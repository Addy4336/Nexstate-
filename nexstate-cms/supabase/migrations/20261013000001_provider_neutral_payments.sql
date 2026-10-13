-- Provider-neutral payments + atomic booking.
-- Applied to the live "RealEstate" project on 2026-10-13 (payments table was empty).

-- 1. Neutral column names (were TotalPay-specific)
alter table public.payments rename column totalpay_transaction_id to provider_payment_id;
alter table public.payments rename column totalpay_status         to provider_status;
alter table public.payments rename column totalpay_response       to provider_response;

-- 2. Provider tracking
alter table public.payments add column if not exists provider        text not null default 'razorpay';
alter table public.payments add column if not exists provider_order_id text;
-- 'none' (not paid yet) | 'confirmed' | 'conflict' (paid but dates were taken: needs a refund) | 'not_applicable'
alter table public.payments add column if not exists booking_status  text not null default 'none';
alter table public.payments alter column currency set default 'INR';

create unique index if not exists payments_provider_order_uidx
    on public.payments (provider, provider_order_id)
    where provider_order_id is not null;

-- 3. Atomic booking: lock the property row, reject overlaps, append the period.
--    Replaces the read-modify-write in the webhook, which could double-book under concurrent callbacks.
create or replace function public.book_property_period(p_property_id text, p_period jsonb)
returns text
language plpgsql
set search_path = public
as $$
declare
    v_start date := (p_period->>'start_date')::date;
    v_end   date := (p_period->>'end_date')::date;
    v_row   public.property%rowtype;
    v_active boolean;
begin
    select * into v_row from public.property where id = p_property_id for update;
    if not found then return 'not_found'; end if;
    if v_start is null or v_end is null or v_end < v_start then return 'conflict'; end if;

    if exists (
        select 1
        from jsonb_array_elements(coalesce(v_row.rental_periods, '[]'::jsonb)) rp
        where rp->>'status' in ('confirmed', 'active')
          and (rp->>'start_date')::date <= v_end
          and (rp->>'end_date')::date   >= v_start
    ) then
        return 'conflict';
    end if;

    v_active := v_start <= current_date and v_end >= current_date;

    update public.property
       set rental_periods       = coalesce(rental_periods, '[]'::jsonb) || jsonb_build_array(p_period),
           current_rental_start = case when v_active then v_start else current_rental_start end,
           current_rental_end   = case when v_active then v_end   else current_rental_end   end,
           status               = case when v_active then 'rented' else status end,
           updated_at           = now()
     where id = p_property_id;

    return 'confirmed';
end;
$$;

revoke all on function public.book_property_period(text, jsonb) from public, anon, authenticated;
grant execute on function public.book_property_period(text, jsonb) to service_role;

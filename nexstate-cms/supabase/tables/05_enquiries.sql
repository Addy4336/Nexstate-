create table public.enquiry (
  id text not null default extensions.uuid_generate_v4 (),
  type text not null,
  name text not null,
  email text not null,
  phone text null,
  property_id text null,
  property_title text null,
  message text null,
  property_details jsonb null,
  status text null default 'new'::text,
  assigned_to text null,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint enquiry_pkey primary key (id),
  constraint enquiry_assigned_to_fkey foreign KEY (assigned_to) references "user" (id) on delete set null,
  constraint enquiry_property_id_fkey foreign KEY (property_id) references property (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists enquiry_type_idx on public.enquiry using btree (type) TABLESPACE pg_default;

create index IF not exists enquiry_status_idx on public.enquiry using btree (status) TABLESPACE pg_default;

create index IF not exists enquiry_created_at_idx on public.enquiry using btree (created_at) TABLESPACE pg_default;
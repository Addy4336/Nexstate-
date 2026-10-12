-- =====================================================
-- PAYMENTS TABLES
-- TotalPay Payment Gateway Integration
-- =====================================================

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS payment_sessions CASCADE;
DROP TABLE IF EXISTS payments CASCADE;

-- =====================================================
-- PAYMENTS TABLE
-- Stores all payment transactions
-- =====================================================
CREATE TABLE payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_number TEXT UNIQUE NOT NULL,
    
    -- References
    property_id TEXT REFERENCES property(id) ON DELETE SET NULL,
    enquiry_id TEXT REFERENCES enquiry(id) ON DELETE SET NULL,
    
    -- Customer details
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_phone TEXT,
    
    -- Payment details
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Booking details (if property booking)
    check_in_date DATE,
    check_out_date DATE,
    guests INTEGER,
    
    -- TotalPay details
    totalpay_transaction_id TEXT,
    totalpay_status TEXT,
    totalpay_response JSONB,
    
    -- Payment status
    status TEXT DEFAULT 'pending', -- pending, success, failed, cancelled, refunded
    payment_method TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- =====================================================
-- PAYMENT SESSIONS TABLE
-- Temporary session data for TotalPay redirects
-- =====================================================
CREATE TABLE payment_sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    payment_id TEXT REFERENCES payments(id) ON DELETE CASCADE,
    session_data JSONB NOT NULL,
    redirect_url TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- Optimize query performance
-- =====================================================
CREATE INDEX idx_payments_order_number ON payments(order_number);
CREATE INDEX idx_payments_property_id ON payments(property_id);
CREATE INDEX idx_payments_enquiry_id ON payments(enquiry_id);
CREATE INDEX idx_payments_user_email ON payments(user_email);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payment_sessions_payment_id ON payment_sessions(payment_id);
CREATE INDEX idx_payment_sessions_expires_at ON payment_sessions(expires_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;

-- Admin full access to payments
CREATE POLICY "Admin full access to payments" ON payments
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Users can view their own payments
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT 
    USING (
        user_email = (
            SELECT email FROM auth.users WHERE id = auth.uid()
        )
    );

-- Allow service role to insert/update (for webhook)
CREATE POLICY "Service role full access to payments" ON payments
    FOR ALL 
    USING (auth.role() = 'service_role');

-- Payment sessions policies
CREATE POLICY "Admin full access to payment_sessions" ON payment_sessions
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Service role full access to payment_sessions" ON payment_sessions
    FOR ALL 
    USING (auth.role() = 'service_role');

-- =====================================================
-- COMMENTS
-- Documentation for tables and columns
-- =====================================================
COMMENT ON TABLE payments IS 'Stores all payment transactions from TotalPay gateway';
COMMENT ON TABLE payment_sessions IS 'Temporary session data for TotalPay checkout redirects';

COMMENT ON COLUMN payments.order_number IS 'Unique order identifier (NS-timestamp-random)';
COMMENT ON COLUMN payments.status IS 'Payment status: pending, success, failed, cancelled, refunded';
COMMENT ON COLUMN payments.totalpay_response IS 'Full JSON response from TotalPay webhook';
COMMENT ON COLUMN payment_sessions.expires_at IS 'Session expiry time (typically 30 minutes from creation)';

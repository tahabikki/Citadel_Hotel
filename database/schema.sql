# Database Schema for Citadel Hôtel PMS

## PostgreSQL + Prisma

### Database: citadel_hotel

---

## Tables

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'GUEST' CHECK (role IN ('GUEST', 'ADMIN', 'STAFF')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### rooms
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('SINGLE', 'DOUBLE', 'TWIN', 'FAMILY')),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  max_guests INTEGER NOT NULL,
  beds VARCHAR(100),
  amenities JSONB,
  floor INTEGER,
  room_number VARCHAR(20) UNIQUE NOT NULL,
  images JSONB,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### reservations
```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  room_id UUID REFERENCES rooms(id),
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(20),
  check_in TIMESTAMP NOT NULL,
  check_out TIMESTAMP NOT NULL,
  guests INTEGER NOT NULL,
  adults INTEGER DEFAULT 2,
  children INTEGER DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
  payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED', 'FAILED')),
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### payments
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'EUR',
  stripe_payment_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'REFUNDED', 'FAILED')),
  method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### tasks
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id),
  user_id UUID REFERENCES users(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('CREATE_CARD', 'REVOKE_CARD', 'UPDATE_CARD')),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
  room_number VARCHAR(20) NOT NULL,
  access_level INTEGER DEFAULT 1,
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  card_data JSONB,
  result JSONB,
  error_message TEXT,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);
```

### logs
```sql
CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  reservation_id UUID REFERENCES reservations(id),
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### hotel_settings
```sql
CREATE TABLE hotel_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) DEFAULT 'Citadel Hôtel',
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) DEFAULT 'France',
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  check_in_time VARCHAR(5) DEFAULT '16:00',
  check_out_time VARCHAR(5) DEFAULT '11:30',
  currency VARCHAR(10) DEFAULT 'EUR',
  timezone VARCHAR(50) DEFAULT 'Europe/Paris',
  stripe_public_key VARCHAR(255),
  stripe_secret_key VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Indexes

```sql
-- Reservations
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_room ON reservations(room_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_check_in ON reservations(check_in);
CREATE INDEX idx_reservations_check_out ON reservations(check_out);

-- Tasks
CREATE INDEX idx_tasks_reservation ON tasks(reservation_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_type ON tasks(type);

-- Logs
CREATE INDEX idx_logs_user ON logs(user_id);
CREATE INDEX idx_logs_reservation ON logs(reservation_id);
CREATE INDEX idx_logs_action ON logs(action);
CREATE INDEX idx_logs_created ON logs(created_at);
```

---

## Sample Data

### Insert Hotel Settings
```sql
INSERT INTO hotel_settings (name, address, city, country, phone, email)
VALUES ('Citadel Hôtel', '28 rue Royale', 'Calais', 'France', '+33 3 21 97 00 00', 'contact@citadelhotel.fr');
```

### Insert Sample Rooms
```sql
INSERT INTO rooms (name, type, description, price, max_guests, beds, amenities, room_number) VALUES
('Family Room - 2 Adjacent Rooms', 'FAMILY', 'Spacious family room with 2 adjacent rooms, perfect for families.', 180, 4, '2 twin beds and 1 queen bed', '["Free WiFi", "TV", "Private Bathroom", "Heating", "Safe"]', '101'),
('Twin Room', 'TWIN', 'Comfortable room with 2 twin beds, ideal for business travelers.', 89, 2, '2 twin beds', '["Free WiFi", "TV", "Private Bathroom", "Heating"]', '102'),
('Double Room', 'DOUBLE', 'Cozy room with a full bed, perfect for couples.', 79, 2, '1 full bed', '["Free WiFi", "TV", "Private Bathroom", "Heating", "Work Desk"]', '103');
```

---

## Connection String

```
postgresql://username:password@localhost:5432/citadel_hotel?schema=public
```

---

## To Set Up

1. Install PostgreSQL
2. Create database: `createdb citadel_hotel`
3. Run Prisma: `npx prisma db push`
4. Or run SQL directly: `psql -f schema.sql`
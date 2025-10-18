#!/bin/bash
#
# Create admin user in the database
# Usage: ./scripts/create-admin-user.sh
#

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}Create Admin User${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""

read -p "Admin email: " ADMIN_EMAIL
read -s -p "Admin password: " ADMIN_PASSWORD
echo ""
read -p "Admin name: " ADMIN_NAME

echo ""
echo -e "${YELLOW}Generating password hash...${NC}"

# Generate bcrypt hash using Node.js
PASSWORD_HASH=$(node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('$ADMIN_PASSWORD', 10));")

echo -e "${YELLOW}Creating SQL script...${NC}"

# Create SQL file
cat > /tmp/create-admin.sql <<EOF
-- Create admin user
INSERT INTO users (id, email, password, name, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'admin-' || gen_random_uuid()::text,
  '$ADMIN_EMAIL',
  '$PASSWORD_HASH',
  '$ADMIN_NAME',
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET
  password = '$PASSWORD_HASH',
  role = 'ADMIN',
  name = '$ADMIN_NAME',
  "updatedAt" = NOW();

-- Verify creation
SELECT id, email, name, role, "createdAt" FROM users WHERE email = '$ADMIN_EMAIL';
EOF

echo ""
echo -e "${GREEN}SQL script created at /tmp/create-admin.sql${NC}"
echo ""
echo -e "${YELLOW}For Docker:${NC}"
echo "docker exec -i b2b_credit_db psql -U postgres -d b2b_credit_db < /tmp/create-admin.sql"
echo ""
echo -e "${YELLOW}For local PostgreSQL:${NC}"
echo "psql -U postgres -d b2b_credit_db < /tmp/create-admin.sql"
echo ""
echo -e "${YELLOW}For AWS RDS:${NC}"
echo "psql -h YOUR_RDS_ENDPOINT -U postgres -d b2b_credit_db < /tmp/create-admin.sql"
echo ""

# If Docker is running, offer to execute
if docker ps | grep -q b2b_credit_db; then
    read -p "Execute on local Docker database now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker exec -i b2b_credit_db psql -U postgres -d b2b_credit_db < /tmp/create-admin.sql
        echo ""
        echo -e "${GREEN}✓ Admin user created successfully!${NC}"
        echo ""
        echo "Login with:"
        echo "  Email: $ADMIN_EMAIL"
        echo "  Password: (your password)"
        echo ""
        echo "Test login:"
        echo "  curl -X POST http://localhost:3000/api/auth/callback/credentials \\"
        echo "    -H 'Content-Type: application/json' \\"
        echo "    -d '{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}'"
    fi
else
    echo -e "${YELLOW}Docker is not running. Execute the command above manually.${NC}"
fi

echo ""

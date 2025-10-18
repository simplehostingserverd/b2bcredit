#!/bin/bash
#
# Setup AWS Secrets Manager secrets for B2B Credit app
# Usage: ./scripts/aws/setup-secrets.sh
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

AWS_REGION=${AWS_REGION:-us-east-1}

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}AWS Secrets Manager Setup${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

echo -e "${YELLOW}This script will help you create secrets in AWS Secrets Manager${NC}"
echo ""

# Function to create or update secret
create_or_update_secret() {
    local secret_name=$1
    local secret_value=$2
    local description=$3

    echo -e "${YELLOW}Creating secret: $secret_name${NC}"

    # Try to create the secret
    aws secretsmanager create-secret \
        --name "$secret_name" \
        --description "$description" \
        --secret-string "$secret_value" \
        --region $AWS_REGION \
        2>/dev/null

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Secret created successfully${NC}"
    else
        # If it already exists, update it
        echo -e "${YELLOW}Secret exists, updating...${NC}"
        aws secretsmanager update-secret \
            --secret-id "$secret_name" \
            --secret-string "$secret_value" \
            --region $AWS_REGION

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Secret updated successfully${NC}"
        else
            echo -e "${RED}✗ Failed to create/update secret${NC}"
            return 1
        fi
    fi

    echo ""
}

# 1. NextAuth Secret
echo -e "${GREEN}1. NextAuth Secret${NC}"
echo "Generate a secure random string for NextAuth JWT signing"
echo ""

NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo -e "Generated secret: ${YELLOW}$NEXTAUTH_SECRET${NC}"
echo ""

read -p "Use this generated secret? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your NextAuth secret: " NEXTAUTH_SECRET
fi

create_or_update_secret \
    "b2bcredit/app/nextauth-secret" \
    "{\"NEXTAUTH_SECRET\":\"$NEXTAUTH_SECRET\"}" \
    "NextAuth JWT signing secret for B2B Credit app"

# 2. Database Credentials
echo -e "${GREEN}2. Database Credentials${NC}"
echo "Enter your RDS database connection details"
echo ""

read -p "Database host (e.g., b2bcredit-db.xxxxx.us-east-1.rds.amazonaws.com): " DB_HOST
read -p "Database port [5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}
read -p "Database name [b2b_credit_db]: " DB_NAME
DB_NAME=${DB_NAME:-b2b_credit_db}
read -p "Database username [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}
read -s -p "Database password: " DB_PASSWORD
echo ""
echo ""

DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

create_or_update_secret \
    "b2bcredit/db/credentials" \
    "{\"DATABASE_URL\":\"$DATABASE_URL\",\"DIRECT_URL\":\"$DATABASE_URL\"}" \
    "Database connection strings for B2B Credit app"

# 3. Fastly Credentials (Optional)
echo -e "${GREEN}3. Fastly CDN Credentials (Optional)${NC}"
read -p "Do you want to configure Fastly CDN? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Fastly Service ID: " FASTLY_SERVICE_ID
    read -p "Fastly API Key: " FASTLY_API_KEY

    create_or_update_secret \
        "b2bcredit/app/fastly" \
        "{\"FASTLY_SERVICE_ID\":\"$FASTLY_SERVICE_ID\",\"FASTLY_API_KEY\":\"$FASTLY_API_KEY\"}" \
        "Fastly CDN credentials for B2B Credit app"
else
    echo "Skipping Fastly configuration"
    echo ""
fi

# 4. Sentry DSN (Optional)
echo -e "${GREEN}4. Sentry Error Tracking (Optional)${NC}"
read -p "Do you want to configure Sentry error tracking? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Sentry DSN: " SENTRY_DSN

    create_or_update_secret \
        "b2bcredit/app/sentry" \
        "{\"NEXT_PUBLIC_SENTRY_DSN\":\"$SENTRY_DSN\"}" \
        "Sentry error tracking DSN for B2B Credit app"
else
    echo "Skipping Sentry configuration"
    echo ""
fi

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}✓ Secrets setup complete!${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""
echo -e "${YELLOW}Created/Updated secrets:${NC}"
echo "  - b2bcredit/app/nextauth-secret"
echo "  - b2bcredit/db/credentials"
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "  - b2bcredit/app/fastly"
    echo "  - b2bcredit/app/sentry"
fi
echo ""
echo -e "${YELLOW}View secrets:${NC}"
echo "aws secretsmanager list-secrets --region $AWS_REGION"
echo ""
echo -e "${YELLOW}Get secret value:${NC}"
echo "aws secretsmanager get-secret-value --secret-id b2bcredit/app/nextauth-secret --region $AWS_REGION"
echo ""

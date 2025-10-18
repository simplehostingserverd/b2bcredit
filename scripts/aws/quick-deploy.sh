#!/bin/bash
#
# Quick deployment script - combines build and deploy steps
# Usage: ./scripts/aws/quick-deploy.sh [environment]
#
# Example: ./scripts/aws/quick-deploy.sh production
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}   B2B Credit Quick Deploy${NC}"
echo -e "${GREEN}   Environment: $ENVIRONMENT${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Step 1: Deploy to ECR
echo -e "${GREEN}Step 1: Building and pushing Docker image to ECR${NC}"
echo -e "${YELLOW}This will take 5-10 minutes...${NC}"
echo ""

bash "$SCRIPT_DIR/deploy-to-ecr.sh" "$ENVIRONMENT"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to deploy to ECR${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Docker image deployed to ECR successfully!${NC}"
echo ""

# Step 2: Update ECS Service
echo -e "${GREEN}Step 2: Updating ECS service${NC}"
echo ""

bash "$SCRIPT_DIR/update-ecs-service.sh" "$ENVIRONMENT"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to update ECS service${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}   ✓ Deployment Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "${YELLOW}What was deployed:${NC}"
echo "  - Built Docker image"
echo "  - Pushed to ECR"
echo "  - Updated ECS service"
echo "  - ECS is pulling new image"
echo ""
echo -e "${YELLOW}Monitor deployment:${NC}"
echo "  1. ECS Console: https://console.aws.amazon.com/ecs"
echo "  2. CloudWatch Logs: https://console.aws.amazon.com/cloudwatch"
echo ""
echo -e "${YELLOW}Test your deployment:${NC}"
echo "  curl https://api.yourdomain.com/api/health"
echo ""

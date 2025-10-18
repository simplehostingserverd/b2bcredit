#!/bin/bash
#
# Update ECS service to force new deployment
# Usage: ./scripts/aws/update-ecs-service.sh [environment]
#
# Example: ./scripts/aws/update-ecs-service.sh production
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
CLUSTER_NAME="b2bcredit-cluster"
SERVICE_NAME="b2bcredit-service"
AWS_REGION=${AWS_REGION:-us-east-1}

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}Update ECS Service${NC}"
echo -e "${GREEN}Environment: $ENVIRONMENT${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

echo -e "${YELLOW}Updating ECS service...${NC}"
echo "Cluster: $CLUSTER_NAME"
echo "Service: $SERVICE_NAME"
echo "Region: $AWS_REGION"
echo ""

# Update service with force new deployment
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --force-new-deployment \
    --region $AWS_REGION \
    --output json > /tmp/ecs-update-output.json

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to update ECS service${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Service update initiated${NC}"
echo ""

# Wait for service to stabilize (optional)
read -p "Wait for service to stabilize? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Waiting for service to become stable...${NC}"
    echo "This may take 5-10 minutes..."
    echo ""

    aws ecs wait services-stable \
        --cluster $CLUSTER_NAME \
        --services $SERVICE_NAME \
        --region $AWS_REGION

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Service is stable${NC}"
    else
        echo -e "${YELLOW}Warning: Wait timed out or failed${NC}"
        echo "Check ECS console for service status"
    fi
fi

echo ""
echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}✓ Update complete!${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""
echo -e "${YELLOW}View deployment status:${NC}"
echo "aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION"
echo ""
echo -e "${YELLOW}View task logs:${NC}"
echo "aws logs tail /ecs/b2bcredit-app --follow --region $AWS_REGION"
echo ""

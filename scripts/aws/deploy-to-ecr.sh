#!/bin/bash
#
# Deploy Docker image to AWS ECR
# Usage: ./scripts/aws/deploy-to-ecr.sh [environment]
#
# Example: ./scripts/aws/deploy-to-ecr.sh production
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
IMAGE_NAME="b2bcredit-app"
AWS_REGION=${AWS_REGION:-us-east-1}

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}AWS ECR Deployment Script${NC}"
echo -e "${GREEN}Environment: $ENVIRONMENT${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Install it from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker is not running${NC}"
    echo "Please start Docker and try again"
    exit 1
fi

# Get AWS account ID
echo -e "${YELLOW}Getting AWS account ID...${NC}"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null)

if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo -e "${RED}Error: Could not get AWS account ID${NC}"
    echo "Make sure you're logged in: aws configure"
    exit 1
fi

echo -e "${GREEN}AWS Account ID: $AWS_ACCOUNT_ID${NC}"
echo ""

# ECR repository URI
ECR_REPOSITORY="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME"

# Authenticate Docker to ECR
echo -e "${YELLOW}Authenticating Docker to AWS ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | \
    docker login --username AWS --password-stdin \
    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to authenticate to ECR${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Authentication successful${NC}"
echo ""

# Build Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t $IMAGE_NAME:latest .

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker image built successfully${NC}"
echo ""

# Tag image
echo -e "${YELLOW}Tagging image for ECR...${NC}"
docker tag $IMAGE_NAME:latest $ECR_REPOSITORY:latest
docker tag $IMAGE_NAME:latest $ECR_REPOSITORY:$ENVIRONMENT
docker tag $IMAGE_NAME:latest $ECR_REPOSITORY:$(date +%Y%m%d-%H%M%S)

echo -e "${GREEN}✓ Image tagged${NC}"
echo ""

# Push to ECR
echo -e "${YELLOW}Pushing image to ECR...${NC}"
echo "Repository: $ECR_REPOSITORY"
echo ""

docker push $ECR_REPOSITORY:latest
docker push $ECR_REPOSITORY:$ENVIRONMENT
docker push $ECR_REPOSITORY:$(date +%Y%m%d-%H%M%S)

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to push image to ECR${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}✓ Deployment successful!${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""
echo "Image pushed to:"
echo "  $ECR_REPOSITORY:latest"
echo "  $ECR_REPOSITORY:$ENVIRONMENT"
echo "  $ECR_REPOSITORY:$(date +%Y%m%d-%H%M%S)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update ECS service to use new image"
echo "2. Run: ./scripts/aws/update-ecs-service.sh $ENVIRONMENT"
echo ""

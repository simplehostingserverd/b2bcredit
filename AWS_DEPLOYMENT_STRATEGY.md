# AWS Deployment Strategy for B2B Credit SaaS

This document provides a complete deployment strategy for deploying the B2B Credit Building SaaS application to AWS using the AWS Console.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Infrastructure Setup](#infrastructure-setup)
4. [Deployment Methods](#deployment-methods)
5. [Step-by-Step Deployment](#step-by-step-deployment)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Cost Optimization](#cost-optimization)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Recommended AWS Architecture

```
Internet
    ↓
CloudFront (CDN) + WAF
    ↓
Application Load Balancer (ALB)
    ↓
ECS Fargate (Auto-scaling)
    ├── Next.js App (Docker Container)
    └── Task Definitions
    ↓
RDS PostgreSQL (Multi-AZ)
    └── Read Replicas (optional)

Additional Services:
- S3: Static assets, backups, document storage
- CloudWatch: Logging and monitoring
- Secrets Manager: Database credentials, API keys
- Route 53: DNS management
- ACM: SSL/TLS certificates
- ElastiCache Redis: Rate limiting, session storage (optional)
```

### Why This Architecture?

1. **Scalability**: ECS Fargate auto-scales based on demand
2. **High Availability**: Multi-AZ deployment
3. **Security**: VPC isolation, security groups, WAF
4. **Cost-Effective**: Pay only for what you use
5. **Managed Services**: Reduce operational overhead

---

## Prerequisites

### AWS Account Requirements

- AWS Account with billing enabled
- IAM user with Administrator Access or these specific permissions:
  - EC2 (full access)
  - ECS (full access)
  - RDS (full access)
  - S3 (full access)
  - CloudWatch (full access)
  - Secrets Manager (full access)
  - Route 53 (full access)
  - ACM (full access)
  - IAM (limited - create roles for ECS)

### Domain & SSL

- Domain name registered (can use Route 53 or external registrar)
- Access to DNS settings

### Local Development Tools

- AWS CLI installed: `aws configure`
- Docker installed and running
- Git access to repository

---

## Infrastructure Setup

### Phase 1: Network & Security

#### 1.1 VPC Setup

1. **Go to VPC Console** → Create VPC
   - Name: `b2bcredit-vpc`
   - IPv4 CIDR: `10.0.0.0/16`
   - Tenancy: Default
   - Enable DNS hostnames: Yes

2. **Create Subnets** (for high availability)
   - Public Subnet 1: `10.0.1.0/24` (us-east-1a)
   - Public Subnet 2: `10.0.2.0/24` (us-east-1b)
   - Private Subnet 1: `10.0.11.0/24` (us-east-1a)
   - Private Subnet 2: `10.0.12.0/24` (us-east-1b)

3. **Create Internet Gateway**
   - Name: `b2bcredit-igw`
   - Attach to VPC

4. **Create NAT Gateway** (for private subnets)
   - Subnet: Public Subnet 1
   - Allocate Elastic IP
   - Name: `b2bcredit-nat`

5. **Create Route Tables**
   - Public Route Table:
     - 0.0.0.0/0 → Internet Gateway
     - Associate with Public Subnets
   - Private Route Table:
     - 0.0.0.0/0 → NAT Gateway
     - Associate with Private Subnets

#### 1.2 Security Groups

1. **ALB Security Group** (`b2bcredit-alb-sg`)
   - Inbound: HTTP (80) from 0.0.0.0/0
   - Inbound: HTTPS (443) from 0.0.0.0/0
   - Outbound: All traffic

2. **ECS Security Group** (`b2bcredit-ecs-sg`)
   - Inbound: Port 3000 from ALB Security Group
   - Outbound: All traffic

3. **RDS Security Group** (`b2bcredit-rds-sg`)
   - Inbound: PostgreSQL (5432) from ECS Security Group
   - Outbound: All traffic

---

### Phase 2: Database Setup

#### 2.1 Create RDS PostgreSQL Database

1. **Go to RDS Console** → Create database

2. **Engine Options**
   - Engine: PostgreSQL
   - Version: 15.x (latest)
   - Template: Production

3. **Settings**
   - DB Instance identifier: `b2bcredit-db`
   - Master username: `postgres`
   - Master password: (Generate strong password, save in Secrets Manager)

4. **Instance Configuration**
   - DB instance class: `db.t3.micro` (dev) or `db.t3.medium` (prod)
   - Storage: 20 GB GP3
   - Enable storage autoscaling: Yes
   - Maximum storage threshold: 100 GB

5. **Availability & Durability**
   - Multi-AZ deployment: Yes (for production)

6. **Connectivity**
   - VPC: `b2bcredit-vpc`
   - Subnet group: Create new with Private Subnets
   - Public access: No
   - VPC security group: `b2bcredit-rds-sg`

7. **Database Authentication**
   - Password authentication

8. **Additional Configuration**
   - Initial database name: `b2b_credit_db`
   - Backup retention: 7 days
   - Enable automated backups: Yes
   - Backup window: 03:00-04:00 UTC
   - Maintenance window: Sun 04:00-05:00 UTC
   - Enable deletion protection: Yes (for production)

9. **Create Database** (takes 10-15 minutes)

10. **Save Credentials to Secrets Manager**
    - Go to Secrets Manager → Store a new secret
    - Secret type: Credentials for RDS database
    - Select database: `b2bcredit-db`
    - Secret name: `b2bcredit/db/credentials`

---

### Phase 3: Container Registry

#### 3.1 Create ECR Repository

1. **Go to ECR Console** → Create repository

2. **Repository Settings**
   - Visibility: Private
   - Repository name: `b2bcredit-app`
   - Tag immutability: Disabled
   - Scan on push: Enabled
   - Encryption: AES-256

3. **Create Repository**

4. **Note the Repository URI** (will be like `123456789.dkr.ecr.us-east-1.amazonaws.com/b2bcredit-app`)

---

### Phase 4: Application Load Balancer

#### 4.1 Create Target Group

1. **Go to EC2 Console** → Target Groups → Create target group

2. **Basic Configuration**
   - Target type: IP addresses
   - Target group name: `b2bcredit-tg`
   - Protocol: HTTP
   - Port: 3000
   - VPC: `b2bcredit-vpc`

3. **Health Checks**
   - Protocol: HTTP
   - Path: `/api/health`
   - Port: traffic port
   - Healthy threshold: 2
   - Unhealthy threshold: 3
   - Timeout: 5
   - Interval: 30
   - Success codes: 200

4. **Create Target Group**

#### 4.2 Request SSL Certificate

1. **Go to ACM Console** → Request certificate

2. **Certificate Type**
   - Public certificate

3. **Domain Names**
   - `api.yourdomain.com`
   - `*.yourdomain.com` (optional wildcard)

4. **Validation Method**
   - DNS validation (recommended)

5. **Create CNAME Records** in Route 53 or your DNS provider

6. **Wait for Validation** (usually 5-30 minutes)

#### 4.3 Create Application Load Balancer

1. **Go to EC2 Console** → Load Balancers → Create Load Balancer

2. **Choose Load Balancer Type**
   - Application Load Balancer

3. **Basic Configuration**
   - Name: `b2bcredit-alb`
   - Scheme: Internet-facing
   - IP address type: IPv4

4. **Network Mapping**
   - VPC: `b2bcredit-vpc`
   - Availability Zones: Select both Public Subnets

5. **Security Groups**
   - Select: `b2bcredit-alb-sg`

6. **Listeners and Routing**
   - Listener 1: HTTP:80 → Redirect to HTTPS
   - Listener 2: HTTPS:443 → Forward to `b2bcredit-tg`
   - SSL Certificate: Select certificate from ACM

7. **Create Load Balancer**

8. **Note the DNS Name** (will be like `b2bcredit-alb-123456789.us-east-1.elb.amazonaws.com`)

---

### Phase 5: ECS Cluster & Service

#### 5.1 Create ECS Cluster

1. **Go to ECS Console** → Clusters → Create Cluster

2. **Cluster Configuration**
   - Cluster name: `b2bcredit-cluster`
   - Infrastructure: AWS Fargate (serverless)

3. **Create Cluster**

#### 5.2 Create IAM Roles

**Task Execution Role** (for ECS to pull images and write logs)

1. **Go to IAM Console** → Roles → Create role
2. Trusted entity: Elastic Container Service Task
3. Attach policies:
   - `AmazonECSTaskExecutionRolePolicy`
   - `SecretsManagerReadWrite`
4. Role name: `b2bcreditEcsTaskExecutionRole`
5. Create role

**Task Role** (for your app to access AWS services)

1. **Create role** with trusted entity: Elastic Container Service Task
2. Attach policies:
   - `AmazonS3FullAccess` (for file uploads)
   - Custom policy for Secrets Manager read access
3. Role name: `b2bcreditEcsTaskRole`
4. Create role

#### 5.3 Create Task Definition

1. **Go to ECS Console** → Task Definitions → Create new Task Definition

2. **Configure Task Definition Family**
   - Task definition family: `b2bcredit-task`

3. **Infrastructure Requirements**
   - Launch type: AWS Fargate
   - Operating system: Linux/X86_64
   - CPU: 0.5 vCPU (512 CPU units)
   - Memory: 1 GB

4. **Task Roles**
   - Task execution role: `b2bcreditEcsTaskExecutionRole`
   - Task role: `b2bcreditEcsTaskRole`

5. **Container - 1**
   - Container name: `b2bcredit-app`
   - Image URI: `123456789.dkr.ecr.us-east-1.amazonaws.com/b2bcredit-app:latest`
   - Port mappings: 3000 TCP

6. **Environment Variables**
   Add these environment variables:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://api.yourdomain.com
   NEXTAUTH_URL=https://api.yourdomain.com
   ```

7. **Secrets** (from Secrets Manager)
   - DATABASE_URL: `b2bcredit/db/credentials:DATABASE_URL`
   - DIRECT_URL: `b2bcredit/db/credentials:DATABASE_URL`
   - NEXTAUTH_SECRET: `b2bcredit/app/nextauth-secret:NEXTAUTH_SECRET`

8. **Logging**
   - Log driver: awslogs
   - Log group: `/ecs/b2bcredit-app` (create if doesn't exist)
   - Region: us-east-1
   - Stream prefix: ecs

9. **Create Task Definition**

#### 5.4 Create ECS Service

1. **Go to ECS Console** → Clusters → `b2bcredit-cluster` → Services → Create

2. **Environment**
   - Compute options: Launch type
   - Launch type: FARGATE

3. **Deployment Configuration**
   - Application type: Service
   - Task definition family: `b2bcredit-task`
   - Service name: `b2bcredit-service`
   - Desired tasks: 2 (for high availability)

4. **Networking**
   - VPC: `b2bcredit-vpc`
   - Subnets: Select Private Subnets
   - Security group: `b2bcredit-ecs-sg`
   - Public IP: Disabled

5. **Load Balancing**
   - Load balancer type: Application Load Balancer
   - Load balancer: `b2bcredit-alb`
   - Target group: `b2bcredit-tg`
   - Health check grace period: 60 seconds

6. **Auto Scaling** (optional but recommended)
   - Minimum tasks: 2
   - Maximum tasks: 10
   - Target tracking scaling policy:
     - Metric: ECSServiceAverageCPUUtilization
     - Target value: 70
     - Scale-out cooldown: 60 seconds
     - Scale-in cooldown: 60 seconds

7. **Create Service**

---

### Phase 6: DNS Configuration

#### 6.1 Create Route 53 Hosted Zone (if not exists)

1. **Go to Route 53 Console** → Hosted zones → Create hosted zone
2. Domain name: `yourdomain.com`
3. Type: Public hosted zone
4. Create

#### 6.2 Create DNS Record for API

1. **Go to Route 53 Console** → Hosted zones → Select your domain

2. **Create Record**
   - Record name: `api`
   - Record type: A
   - Alias: Yes
   - Route traffic to: Alias to Application Load Balancer
   - Region: us-east-1
   - Load balancer: `b2bcredit-alb`
   - Routing policy: Simple routing
   - Create record

3. **Verify DNS Propagation** (can take 5-60 minutes)
   ```bash
   dig api.yourdomain.com
   nslookup api.yourdomain.com
   ```

---

## Deployment Methods

### Method 1: Push Docker Image to ECR (Recommended)

This method is best for production deployments.

#### Step 1: Build Docker Image Locally

```bash
cd /Users/softwareprosorg/Documents/b2bcredit

# Build the image
docker build -t b2bcredit-app:latest .
```

#### Step 2: Authenticate Docker to ECR

```bash
# Get AWS account ID
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-east-1

# Authenticate Docker to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

#### Step 3: Tag and Push Image

```bash
# Tag the image
docker tag b2bcredit-app:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/b2bcredit-app:latest

# Push to ECR
docker push \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/b2bcredit-app:latest
```

#### Step 4: Update ECS Service

```bash
# Force new deployment
aws ecs update-service \
  --cluster b2bcredit-cluster \
  --service b2bcredit-service \
  --force-new-deployment \
  --region $AWS_REGION
```

### Method 2: Use GitHub Actions CI/CD (Best for Teams)

See the CI/CD pipeline already configured in `.github/workflows/ci.yml`

Add these secrets to GitHub:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ACCOUNT_ID`
- `AWS_REGION`

---

## Post-Deployment Configuration

### 1. Configure Secrets Manager

Create these secrets in AWS Secrets Manager:

#### Database URL Secret
```bash
aws secretsmanager create-secret \
  --name b2bcredit/db/credentials \
  --secret-string '{
    "DATABASE_URL":"postgresql://postgres:PASSWORD@b2bcredit-db.XXXXXX.us-east-1.rds.amazonaws.com:5432/b2b_credit_db",
    "DIRECT_URL":"postgresql://postgres:PASSWORD@b2bcredit-db.XXXXXX.us-east-1.rds.amazonaws.com:5432/b2b_credit_db"
  }'
```

#### NextAuth Secret
```bash
# Generate a secure random string
openssl rand -base64 32

# Store in Secrets Manager
aws secretsmanager create-secret \
  --name b2bcredit/app/nextauth-secret \
  --secret-string '{"NEXTAUTH_SECRET":"YOUR_GENERATED_SECRET"}'
```

### 2. Run Database Migrations

The migrations run automatically when the container starts (see `scripts/start.sh`).

To verify:
```bash
# Check ECS task logs in CloudWatch
aws logs tail /ecs/b2bcredit-app --follow
```

### 3. Create Admin User

Connect to your database using a bastion host or RDS Query Editor:

```sql
-- Create admin user
INSERT INTO users (id, email, password, name, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'admin-' || gen_random_uuid()::text,
  'admin@yourdomain.com',
  '$2a$10$HASHED_PASSWORD', -- Hash with bcrypt
  'Admin User',
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
);
```

Generate password hash:
```bash
# Using Node.js
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

### 4. Test the Deployment

```bash
# Test health endpoint
curl https://api.yourdomain.com/api/health

# Test OpenAPI docs
curl https://api.yourdomain.com/openapi.json

# Test Swagger UI
open https://api.yourdomain.com/api-docs
```

---

## Monitoring & Maintenance

### CloudWatch Dashboards

1. **Go to CloudWatch Console** → Dashboards → Create dashboard

2. **Add Widgets**
   - ECS CPU & Memory utilization
   - RDS connections & CPU
   - ALB request count & latency
   - ALB 4xx/5xx errors

### CloudWatch Alarms

Create alarms for:

1. **High CPU Utilization** (ECS)
   - Metric: CPUUtilization
   - Threshold: > 80% for 5 minutes
   - Action: SNS notification

2. **High Database Connections** (RDS)
   - Metric: DatabaseConnections
   - Threshold: > 80 connections
   - Action: SNS notification

3. **ALB 5xx Errors**
   - Metric: HTTPCode_Target_5XX_Count
   - Threshold: > 10 in 5 minutes
   - Action: SNS notification

### Log Aggregation

All logs go to CloudWatch Logs at `/ecs/b2bcredit-app`

To view logs:
```bash
# Real-time logs
aws logs tail /ecs/b2bcredit-app --follow

# Query logs
aws logs filter-log-events \
  --log-group-name /ecs/b2bcredit-app \
  --filter-pattern "ERROR"
```

### Database Backups

RDS automated backups are configured for 7 days retention.

Manual snapshot:
```bash
aws rds create-db-snapshot \
  --db-instance-identifier b2bcredit-db \
  --db-snapshot-identifier b2bcredit-db-snapshot-$(date +%Y%m%d)
```

---

## Cost Optimization

### Estimated Monthly Costs (US East 1)

**Development/Staging:**
- RDS db.t3.micro (1 instance): ~$15/month
- ECS Fargate (2 tasks, 0.5 vCPU, 1GB): ~$30/month
- ALB: ~$20/month
- NAT Gateway: ~$32/month
- Data transfer: ~$10/month
- **Total: ~$107/month**

**Production:**
- RDS db.t3.medium Multi-AZ: ~$120/month
- ECS Fargate (4 tasks avg, 0.5 vCPU, 1GB): ~$60/month
- ALB: ~$20/month
- NAT Gateway (2): ~$64/month
- CloudFront: ~$10/month
- Data transfer: ~$20/month
- **Total: ~$294/month**

### Cost-Saving Tips

1. **Use Savings Plans** for ECS Fargate (up to 50% discount)
2. **Reserved Instances** for RDS (up to 70% discount)
3. **Auto-scaling** to scale down during off-hours
4. **Delete old ECR images** to reduce storage costs
5. **Use S3 lifecycle policies** for old backups

---

## Troubleshooting

### Container Won't Start

**Check task logs:**
```bash
aws logs tail /ecs/b2bcredit-app --follow
```

**Common issues:**
- Missing environment variables
- Database connection failed
- Secrets Manager permissions

### Database Connection Failed

**Check:**
1. Security group allows traffic from ECS
2. RDS endpoint is correct in DATABASE_URL
3. Credentials in Secrets Manager are correct
4. Database exists

### ALB Health Checks Failing

**Check:**
1. `/api/health` endpoint returns 200
2. ECS security group allows traffic from ALB
3. Container is listening on port 3000

### Deployment Takes Too Long

**Check:**
1. Image pull time from ECR
2. Health check grace period (increase if needed)
3. Task startup time

### High Costs

**Review:**
1. Number of running tasks
2. NAT Gateway data transfer
3. RDS instance size
4. ALB idle connections

---

## Next Steps

1. **Add Fastly CDN** (see FASTLY_INTEGRATION.md)
2. **Configure Redis** for rate limiting and sessions
3. **Set up monitoring** with DataDog or New Relic
4. **Add disaster recovery** plan
5. **Configure WAF** rules on CloudFront
6. **Set up CI/CD** pipeline improvements

---

## Additional Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS RDS PostgreSQL Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [Next.js Deployment Best Practices](https://nextjs.org/docs/deployment)
- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

## Support

For issues with this deployment:
1. Check CloudWatch logs first
2. Review security groups and network configuration
3. Verify Secrets Manager credentials
4. Contact AWS Support for infrastructure issues

**Document Version:** 1.0
**Last Updated:** 2025-10-18
**Maintained By:** Development Team

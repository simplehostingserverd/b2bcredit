#!/bin/bash

# Fix Next.js 15 params type issue in all dynamic route files
# Replace { params }: { params: { id: string } } with { params }: { params: Promise<{ id: string }> }
# and add const { id } = await params

FILES=(
  "app/api/admin/leads/[id]/route.ts"
  "app/api/documents/[id]/route.ts"
  "app/api/blog/categories/[id]/route.ts"
  "app/api/admin/blog/[id]/route.ts"
  "app/api/admin/newsletter/[id]/route.ts"
  "app/api/admin/users/[id]/route.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."

    # Use sed to replace the type signature
    # This is a simplified approach - for complex cases, manual review is needed
    sed -i.bak 's/{ params }: { params: { id: string } }/{ params }: { params: Promise<{ id: string }> }/g' "$file"

    echo "✓ Updated $file"
  else
    echo "✗ File not found: $file"
  fi
done

echo "Done! Please manually add 'const { id } = await params' after type checking in each handler."

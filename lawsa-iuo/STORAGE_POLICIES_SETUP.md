# Storage Bucket RLS Policy Setup

Since storage bucket policies cannot be created via SQL in Supabase, you need to configure them manually in the UI.

## Step 1: Run the Tables SQL

1. Go to Supabase Dashboard → SQL Editor
2. Open the file: `database/tables-setup.sql`
3. Run it - this will create all the tables and database policies

## Step 2: Configure Storage Policies

### For "documents" bucket:

1. Go to Supabase Dashboard → Storage → Buckets
2. Click on "documents" bucket
3. Click "Policies" tab
4. Click "New Policy" and add these 4 policies:

#### Policy 1: SELECT (View own documents)
- Name: "Users can view own documents"
- Allowed operation: SELECT
- Target roles: authenticated
- Policy definition:
```
bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
```

#### Policy 2: INSERT (Upload documents)
- Name: "Users can upload own documents"
- Allowed operation: INSERT
- Target roles: authenticated
- Policy definition:
```
bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
```

#### Policy 3: UPDATE (Update documents)
- Name: "Users can update own documents"
- Allowed operation: UPDATE
- Target roles: authenticated
- Policy definition:
```
bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
```

#### Policy 4: DELETE (Delete documents)
- Name: "Users can delete own documents"
- Allowed operation: DELETE
- Target roles: authenticated
- Policy definition:
```
bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
```

### For "profiles" bucket:

1. Go to Storage → Buckets → "profiles"
2. Click "Policies" tab
3. Add these policies:

#### Policy 1: SELECT (Public read)
- Name: "Public can view profile avatars"
- Allowed operation: SELECT
- Target roles: anon, authenticated
- Policy definition:
```
bucket_id = 'profiles'
```

#### Policy 2: INSERT (Upload)
- Name: "Users can upload own avatar"
- Allowed operation: INSERT
- Target roles: authenticated
- Policy definition:
```
bucket_id = 'profiles' and auth.uid()::text = (storage.foldername(name))[1]
```

#### Policy 3: UPDATE
- Name: "Users can update own avatar"
- Allowed operation: UPDATE
- Target roles: authenticated
- Policy definition:
```
bucket_id = 'profiles' and auth.uid()::text = (storage.foldername(name))[1]
```

#### Policy 4: DELETE
- Name: "Users can delete own avatar"
- Allowed operation: DELETE
- Target roles: authenticated
- Policy definition:
```
bucket_id = 'profiles' and auth.uid()::text = (storage.foldername(name))[1]
```

## Step 3: Verify Setup

After completing both steps, test by:
1. Going to Professor Steve page
2. Uploading a PDF document
3. It should complete successfully and show in sources

## Troubleshooting

If upload still fails at 50%:
1. Check browser console for specific errors
2. Verify bucket exists in Storage → Buckets
3. Make sure policies are saved correctly
4. Check that the file is under 10MB (documents bucket limit)

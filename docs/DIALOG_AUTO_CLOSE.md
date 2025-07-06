# Dialog Auto-Close Feature

## Overview

The system maintenance dashboard now automatically closes the operation details dialog when the currently viewed operation is deleted. This provides a better user experience by preventing users from viewing details of an operation that no longer exists.

## Implementation

### Modified Function: `deleteOperation`

The `deleteOperation` function in `components/settings/system-maintenance-dashboard.tsx` has been enhanced to:

1. **Check if the deleted operation is currently being viewed**
2. **Close the dialog automatically** if the deleted operation matches the selected operation
3. **Clear the selected operation state** to prevent stale data

### Code Changes

```typescript
const deleteOperation = async (type: string, id: string) => {
  // ... existing authentication and API call logic ...

  if (response.ok) {
    toast({
      title: "Success",
      description: `${type} deleted successfully`,
    })
    
    // Close dialog if the deleted operation is currently being viewed
    if (selectedOperation && selectedOperation.id === id) {
      setShowDetails(false)
      setSelectedOperation(null)
    }
    
    fetchOperations()
  }
  
  // ... existing error handling ...
}
```

## User Experience

### Before the Feature
- User opens a security scan report dialog
- User clicks delete button in the dialog
- Operation is deleted from the database
- Dialog remains open showing details of a non-existent operation
- User has to manually close the dialog

### After the Feature
- User opens a security scan report dialog
- User clicks delete button in the dialog
- Operation is deleted from the database
- Dialog automatically closes
- User sees success toast notification
- Operation list is refreshed

## Benefits

1. **Improved UX**: Users don't see stale data after deletion
2. **Consistency**: Dialog state matches the actual data state
3. **Clarity**: Users immediately understand the operation was deleted
4. **Efficiency**: No manual dialog closing required

## Technical Details

### State Management
- `selectedOperation`: Currently viewed operation details
- `showDetails`: Dialog open/close state
- `deleting`: Loading state for delete operations

### Dialog Close Logic
```typescript
// Close dialog if the deleted operation is currently being viewed
if (selectedOperation && selectedOperation.id === id) {
  setShowDetails(false)        // Close the dialog
  setSelectedOperation(null)   // Clear selected operation
}
```

### Error Handling
- Dialog only closes on successful deletion
- Failed deletions don't affect dialog state
- User can still manually close dialog if needed

## Testing

### Test Scenarios

1. **Delete from Dialog**
   - Open operation details dialog
   - Click delete button in dialog
   - Verify dialog closes automatically
   - Verify operation disappears from list

2. **Delete from Card**
   - Open operation details dialog
   - Click delete button on operation card (outside dialog)
   - Verify dialog closes automatically
   - Verify operation disappears from list

3. **Delete Different Operation**
   - Open operation A details dialog
   - Delete operation B from card
   - Verify dialog stays open (showing operation A)
   - Verify operation B disappears from list

4. **Failed Deletion**
   - Open operation details dialog
   - Attempt to delete with network error
   - Verify dialog stays open
   - Verify error toast is shown

## Compatibility

This feature works with all operation types:
- Security Scans
- System Health Checks
- Backup Operations
- Cache Clear Operations

## Future Enhancements

Potential improvements to consider:

1. **Confirmation Dialog**: Add confirmation before auto-closing
2. **Undo Functionality**: Allow users to undo deletion
3. **Bulk Operations**: Handle multiple operation deletions
4. **Animation**: Smooth transition when dialog closes 
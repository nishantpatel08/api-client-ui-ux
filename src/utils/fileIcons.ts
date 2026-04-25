export function getFileIcon(type: string, isOpen = false): string {
  switch (type) {
    case 'folder':
      return isOpen ? '📂' : '📁';
    case 'ts':
      return '🔷';
    case 'json':
      return '🟡';
    case 'md':
      return '📝';
    default:
      return '📄';
  }
}

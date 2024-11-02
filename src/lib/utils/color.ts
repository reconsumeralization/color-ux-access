export function getColorForType(type: string): string {
  const colors = {
    'protanopia': 'rgb(255, 99, 132)',
    'deuteranopia': 'rgb(54, 162, 235)',
    'tritanopia': 'rgb(75, 192, 192)',
    'achromatopsia': 'rgb(153, 102, 255)'
  };
  return colors[type as keyof typeof colors] || 'rgb(201, 203, 207)';
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
} 
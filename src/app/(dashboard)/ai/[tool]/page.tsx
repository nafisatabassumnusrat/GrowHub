import AiToolClient from './AiToolClient';

export function generateStaticParams() {
  return [
    { tool: 'plant-disease' },
    { tool: 'weed-detection' },
    { tool: 'fish-disease' },
    { tool: 'fish-species' },
  ];
}

export default async function AiToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;
  return <AiToolClient tool={tool} />;
}

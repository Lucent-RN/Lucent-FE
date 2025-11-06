import { delay } from '@/constants/mock-api';
import { PieGraph } from '@/features/overview/organisms/pie-graph';

export default async function Stats() {
  await delay(1000);
  return <PieGraph />;
}

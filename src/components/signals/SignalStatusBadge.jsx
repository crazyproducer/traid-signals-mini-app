import Badge from '../shared/Badge';
import { formatSignalStatus } from '../../utils/formatters';

const STATUS_VARIANT_MAP = {
  ACTIVE: 'active',
  UPDATED: 'active',
  TRIGGERED: 'triggered',
  HIT_TP: 'win',
  HIT_SL: 'loss',
  EXPIRED: 'expired',
};

export default function SignalStatusBadge({ status }) {
  const variant = STATUS_VARIANT_MAP[status] || 'expired';
  return <Badge variant={variant}>{formatSignalStatus(status)}</Badge>;
}

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="flex items-center gap-1.5 text-[14px] font-medium text-tg-accent pressable mb-4"
    >
      <ArrowLeft size={18} strokeWidth={2} />
      <span>Back</span>
    </button>
  );
}

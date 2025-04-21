import Modal from "./Modal";
import { AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  buttonText: string;
  targetRoute: string;
}

export default function RouteModal({
  isOpen,
  onClose,
  message,
  buttonText,
  targetRoute,
}: RouteModalProps) {
  const router = useRouter();
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          onAction={() => {
            onClose();
            router.push(targetRoute);
          }}
          size="sm"
          buttonTitle={buttonText}
        >
          {message}
        </Modal>
      )}
    </AnimatePresence>
  );
}

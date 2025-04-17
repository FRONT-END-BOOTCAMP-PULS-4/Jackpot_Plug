"use client";

import { useEffect, useState } from "react";
import Portal from "../Portal";
import styles from "./Toast.module.scss";
import { useToastStore } from "@/store/toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast() {
  const [mounted, setMounted] = useState(false);
  const { message, visible } = useToastStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 마운트되었는지 확인
  if (!mounted) return null;

  const toastContent = (
    <div className={styles.toast_container}>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
            className={styles.toast}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return <Portal id="toast-root" content={toastContent} />;
}

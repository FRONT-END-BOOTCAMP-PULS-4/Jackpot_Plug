"use client";

import { useEffect, useState } from "react";
import Portal from "../Portal";
import styles from "./Toast.module.scss";
import { useToastStore } from "@/store/toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast() {
  const [mounted, setMounted] = useState(false);
  const { message, visible, type } = useToastStore();
  console.log("toast", message, visible, type);
  const toastStyle = `${styles.toast} ${
    type != "default" ? styles[`${type}`] : ""
  }`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // 마운트되었는지 확인
  if (!mounted) return null;

  const toastContent = (
    <AnimatePresence>
      {visible && (
        <div className={styles.toast_container}>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
            className={toastStyle}
          >
            {message}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return <Portal id="toast-root" content={toastContent} />;
}

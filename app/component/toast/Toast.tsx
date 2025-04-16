"use client";

import { createPortal } from "react-dom";
import Portal from "../Portal";
import styles from "./Toast.module.scss";
import { useToastStore } from "@/store/toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast() {
  const { message, visible } = useToastStore();

  if (typeof window === "undefined") return null;

  const toastContent = (
    <div className={styles.toast_container}>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
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

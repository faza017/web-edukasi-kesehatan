"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

/** Konfirmasi sebelum aksi berbahaya, mis. hapus (PRD KJ-6). */
export default function ConfirmDialog({
  open,
  title = "Konfirmasi",
  message,
  confirmLabel = "Hapus",
  tone = "danger",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="leading-relaxed text-muted">{message}</p>
    </Modal>
  );
}


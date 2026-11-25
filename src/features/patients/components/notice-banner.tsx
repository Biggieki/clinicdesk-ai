interface NoticeBannerProps {
  message: string | null;
  onDismiss: () => void;
}

/**
 * Confirmation banner ("Patient added", etc.). The live region is always
 * rendered, even when empty, because screen readers only announce changes to
 * a live region that already exists in the page.
 */
export function NoticeBanner({ message, onDismiss }: NoticeBannerProps) {
  return (
    <div role="status" aria-live="polite">
      {message && (
        <div className="patients-notice">
          <span>{message}</span>
          <button type="button" className="notice-dismiss" onClick={onDismiss} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}
    </div>
  );
}

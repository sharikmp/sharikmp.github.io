class Notification {
    static TYPE_MAP = {
        error: "danger",
        warning: "warning",
        success: "success",
        info: "secondary",
        display: "secondary"
    };

    static toast(message, type, duration = 3000, autoRemove = true) {
        const bsClass = Notification.TYPE_MAP[type] || "secondary";
        const root = Notification.ensureRoot();
        const { iconClass, iconColor } = Notification.iconForType(bsClass);

        const card = document.createElement("div");
        card.className = `alert alert-${bsClass} flash-card d-flex align-items-center justify-content-between fade`;
        card.setAttribute("role", "alert");
        card.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <i class="fas ${iconClass}" style="color: ${iconColor}"></i>
                <span>${message}</span>
            </div>
            <button type="button" class="btn-close btn-close-white" aria-label="Close"></button>
        `;

        const closeBtn = card.querySelector(".btn-close");
        let timer = null;
        const removeCard = () => {
            if (timer) clearTimeout(timer);
            card.classList.remove("show");
            setTimeout(() => card.remove(), 150);
        };
        closeBtn.onclick = removeCard;

        root.appendChild(card);
        requestAnimationFrame(() => card.classList.add("show"));

        if (autoRemove) {
            timer = setTimeout(removeCard, duration);
        }
        return { remove: removeCard };
    }

            static ensureRoot() {
                let root = document.getElementById("flash-root");
                if (!root) {
                    root = document.createElement("div");
                    root.id = "flash-root";
                    document.body.appendChild(root);
                }
                root.classList.add("flash-root", "notification-scope");
                return root;
            }

    static iconForType(bsClass) {
        const defaults = { iconClass: "fa-info-circle", iconColor: "var(--td-text-primary)" };
        if (bsClass === "success") return { iconClass: "fa-check-circle", iconColor: "var(--td-success)" };
        if (bsClass === "warning") return { iconClass: "fa-exclamation-triangle", iconColor: "var(--td-warning)" };
        if (bsClass === "danger") return { iconClass: "fa-exclamation-circle", iconColor: "var(--td-danger)" };
        return defaults;
    }
}

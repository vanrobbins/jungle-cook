//Class Example
export function createToast(toastObj) {
	const toastDiv = document.createElement("div");
	const message = document.createElement("p");
	toastDiv.className = "toast";
	message.innerText = toastObj.message;
	toastDiv.appendChild(message);
	document.body.appendChild(toastDiv);
	requestAnimationFrame(() => toastDiv.classList.add("show"));
	setTimeout(() => {
		toastDiv.classList.remove("show");
		toastDiv.classList.add("hide");
		setTimeout(() => {
			document.body.removeChild(toastDiv);
		}, 500);
	}, 3000);
}
//My alert
export function createAlert(alertObj) {
	//Items
	const alertDiv = document.createElement("div");
	const alert = document.createElement("div");
	const btnBar = document.createElement("div");
	const cancelBtn = document.createElement("div");
	const confirmBtn = document.createElement("div");
	const message = document.createElement("p");
	const title = document.createElement("h1");
	//Assignments
	alertDiv.className = "alert-holder";
	alert.className = "alert-callout";
	btnBar.className = "button-bar";
	confirmBtn.className = "btn confirm";
	cancelBtn.className = "btn cancel";
	//Modifiers
	title.innerText = alertObj.title || "Title";
	message.innerText = alertObj.message;
	confirmBtn.innerText = alertObj.confirmText || "Confirm";
	cancelBtn.innerText = alertObj.cancelText || "Cancel";

	// Determine alert type and set default actions
	const alertType = alertObj.type || "default";

	//Add elements
	btnBar.appendChild(confirmBtn);

	// Only show cancel button if type allows it
	if (alertType !== "error") {
		btnBar.appendChild(cancelBtn);
	}

	alert.appendChild(title);
	alert.appendChild(message);
	alert.appendChild(btnBar);
	alertDiv.appendChild(alert);
	document.body.appendChild(alertDiv);

	// Helper function to remove alert
	const removeAlert = () => {
		if (document.body.contains(alertDiv)) {
			document.body.removeChild(alertDiv);
		}
	};

	//Add actions
	// Close when clicking on backdrop (outside alert), not when clicking inside
	alertDiv.addEventListener("click", (e) => {
		// Only close if clicked element is the backdrop itself, not a child
		if (e.target === alertDiv) {
			if (alertObj.onCancel) {
				alertObj.onCancel();
				removeAlert();
			} else if (alertObj.onConfirm) {
				alertObj.onConfirm();
				removeAlert();
			} else {
				removeAlert();
			}
		}
	});

	// Button handlers based on type
	cancelBtn.addEventListener("click", () => {
		if (alertObj.onCancel) {
			alertObj.onCancel();
		}
		removeAlert();
	});

	confirmBtn.addEventListener("click", () => {
		// Type-specific default behaviors
		if (alertType === "404") {
			removeAlert();
			window.location.hash = "#home";
		} else if (alertType === "error") {
			removeAlert();
		} else {
			// Custom callback if provided
			if (alertObj.onConfirm) {
				alertObj.onConfirm();
			}
			removeAlert();
		}
	});
}

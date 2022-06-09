import { Component, OnInit, ViewChild } from "@angular/core";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";

@Component({
	selector: "app-toast",
	templateUrl: "./toast.component.html"
})
export class ToastComponent implements OnInit {
	@ViewChild(ToastContainerDirective, { static: true })
	toastContainer!: ToastContainerDirective;

	constructor(private toastr: ToastrService) {
		this.toastr.overlayContainer = this.toastContainer;
	}
	ngOnInit(): void {}

	successToast(message: string) {
		this.toastr.success(message);
	}

	errorToast(message: string) {
		this.toastr.error(message);
	}

	mapFunctions = new Map([
		["success", (message: string) => this.successToast(message)],
		["error", (message: string) => this.errorToast(message)]
	]);

	toast(type: string, message: string) {
		if (this.mapFunctions.has(type)) {
			const toastFunction = this.mapFunctions.get(type);
			toastFunction?.(message);
		}
	}
}

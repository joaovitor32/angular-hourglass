import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { interval } from "rxjs";

import { Toast, ToastrService } from "ngx-toastr";
import { ToastComponent } from "src/app/components/toast/toast.component";

import {
	FormBuilder,
	FormGroup,
	NgForm,
	ValidationErrors,
	Validators
} from "@angular/forms";

type ControlErrorType = ValidationErrors | undefined | null;
type HourglassType = boolean[][];

interface CheckRowInterface {
	row: boolean[];
	rowIndex: number;
	currentTime: number;
}

@Component({
	selector: "app-hourglass",
	templateUrl: "./hourglass.component.html",
	styleUrls: ["./hourglass.component.scss"],
	encapsulation: ViewEncapsulation.Emulated
})
export class HourglassComponent implements OnInit {
	hourglass: HourglassType = [[]];
	centerIndex = 0;
	mappedIndex: number[] = [];
	hourglassIndex: number[] = [];
	toastComponent: ToastComponent;

	checkoutForm!: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private toastr: ToastrService
	) {
		this.toastComponent = new ToastComponent(this.toastr);
	}

	buildHourglass() {
		this.hourglass = Array(this.getSize()).fill(
			Array(this.getSize()).fill(true)
		) as boolean[][];
		this.centerIndex = (this.getSize() - 1) / 2;

		this.fillUpperTriangle();
		this.startHourglass();
	}

	ngOnInit(): void {
		this.checkoutForm = this.formBuilder.group({
			size: [0, [Validators.min(3), Validators.pattern(/^[0-9]*$/)]]
		});

		this.buildHourglass();
	}

	getSize() {
		return this.checkoutForm.get("size")?.value | 0;
	}

	getFormValidationErrors() {
		return Object.keys(this.checkoutForm.controls).map((key) => {
			const controlErrors: ControlErrorType =
				this.checkoutForm.get(key)?.errors;

			if (controlErrors) {
				this.toastComponent.toast(
					"error",
					`O input ${key} apresenta erros.`
				);
				return false;
			}

			return true;
		});
	}

	onSubmit() {
		const errors = this.getFormValidationErrors();
		const checkErrorsExistence = errors.some((error) => error);

		if (checkErrorsExistence) {
			this.toastComponent.toast(
				"success",
				"Ampulheta reininciada com sucesso"
			);
			this.buildHourglass();
		}
	}

	centerOfMatrix(rowIndex: number, columnIndex: number) {
		return (
			this.centerIndex === rowIndex && this.centerIndex === columnIndex
		);
	}

	fillUpperTriangle() {
		this.hourglass = this.hourglass.map((row, rowIndex) => {
			return row.map((_, columnIndex) => {
				const isCenter = this.centerOfMatrix(rowIndex, columnIndex);

				const removeLeftEdge = rowIndex - columnIndex <= 0;
				const removeRightEdge =
					this.getSize() - columnIndex - rowIndex > 0;

				return (removeLeftEdge && removeRightEdge) || isCenter;
			});
		});
	}
	// Validate column and row inside the following function
	checkColumn({ row, rowIndex, currentTime }: CheckRowInterface) {
		return row.map((column, columnIndex) => {
			const removeLeftEdge = rowIndex - columnIndex > 0;
			const removeRightEdge =
				this.getSize() - columnIndex - rowIndex <= 0;

			if (rowIndex + currentTime <= this.getSize() - 1) {
				return false;
			}

			return removeLeftEdge && removeRightEdge;
		});
	}
	checkRow(currentTime: number) {
		return this.hourglass.map((row, rowIndex) => {
			return this.checkColumn({ row, rowIndex, currentTime });
		});
	}

	startHourglass() {
		const timer = interval(1500).subscribe((currentTime) => {
			if (currentTime === this.getSize() - 1) {
				timer.unsubscribe();
			}

			this.hourglass = this.checkRow(currentTime);
		});
	}
}

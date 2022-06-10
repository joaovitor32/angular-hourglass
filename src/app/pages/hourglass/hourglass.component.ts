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
			Array(this.getSize()).fill(false)
		) as boolean[][];

		this.centerIndex = (this.getSize() - 1) / 2;

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

	removeUpperLeftEdge(rowIndex: number, columnIndex: number) {
		return rowIndex - columnIndex <= 0;
	}

	removeUpperRightEdge(rowIndex: number, columnIndex: number) {
		return this.getSize() - columnIndex - rowIndex > 0;
	}

	removeLowerLeftEdge(rowIndex: number, columnIndex: number) {
		return rowIndex - columnIndex > -1;
	}

	removeRightLeftEdge(rowIndex: number, columnIndex: number) {
		return this.getSize() - columnIndex - rowIndex <= 1;
	}

	checkColumn({ row, rowIndex, currentTime }: CheckRowInterface) {
		const checkHourglassQuadrant =
			rowIndex + currentTime >= this.getSize() - 1;

		return row.map((column, columnIndex) => {
			const removeUpperLeftEdge = this.removeUpperLeftEdge(
				rowIndex,
				columnIndex
			);
			const removeUpperRightEdge = this.removeUpperRightEdge(
				rowIndex,
				columnIndex
			);

			const removeLowerLeftEdge = this.removeLowerLeftEdge(
				rowIndex,
				columnIndex
			);

			const removeLowerRightEdge = this.removeRightLeftEdge(
				rowIndex,
				columnIndex
			);

			if (checkHourglassQuadrant)
				return removeLowerLeftEdge && removeLowerRightEdge;

			if (currentTime <= rowIndex) {
				const isCenter = this.centerOfMatrix(rowIndex, columnIndex);

				return (
					(removeUpperLeftEdge && removeUpperRightEdge) || isCenter
				);
			}

			return false;
		});
	}
	checkRow(currentTime: number) {
		return this.hourglass.map((row, rowIndex) => {
			return this.checkColumn({ row, rowIndex, currentTime });
		});
	}

	startHourglass() {
		const sizeRemainder = this.getSize() % 2 === 0;

		const size = sizeRemainder
			? this.getSize() / 2
			: (this.getSize() - 1) / 2;

		const timer = interval(1000).subscribe((currentTime) => {
			if (currentTime === size) {
				timer.unsubscribe();
			}

			this.hourglass = this.checkRow(currentTime);
		});
	}
}

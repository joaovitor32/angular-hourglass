import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

type ValueType = number | boolean | string | undefined | unknown;
type OnChangeType = (value: ValueType) => void;
type OnTouchedType = () => void;

@Component({
	selector: "app-input",
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.scss"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputComponent),
			multi: true
		}
	]
})
export class InputComponent implements ControlValueAccessor {
	@Input()
	label: string | undefined;

	@Input()
	name: string | undefined;

	@Input()
	type: string | undefined;

	onChange!: OnChangeType;
	onTouched!: OnTouchedType;

	@Input()
	value: ValueType;

	get _value() {
		return this.value;
	}

	set _value(val: ValueType) {
		this.value = val;
		this.onChange(val);
		this.onTouched();
	}

	writeValue(value: ValueType) {
		if (value) {
			this.onChange(value);
		}
	}

	registerOnChange(fn: OnChangeType): void {
		this.onChange = (val: ValueType) => {
			fn(val);
		};
	}

	registerOnTouched(fn: OnTouchedType): void {
		this.onTouched = () => {
			fn();
		};
	}

	getIsFilledInput() {
		return !!this.value;
	}
}

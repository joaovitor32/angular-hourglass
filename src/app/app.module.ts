import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PieceOfSandComponent } from "./components/piece-of-sand/piece-of-sand.component";
import { HourglassComponent } from "./pages/hourglass/hourglass.component";
import { InputComponent } from "./components/input/input.component";
import { ButtonComponent } from "./components/button/button.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastComponent } from "./components/toast/toast.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";

@NgModule({
	declarations: [
		AppComponent,
		PieceOfSandComponent,
		HourglassComponent,
		InputComponent,
		ButtonComponent,
		ToastComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot({})
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}

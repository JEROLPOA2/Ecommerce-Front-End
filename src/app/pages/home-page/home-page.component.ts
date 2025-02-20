import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ModelService } from '../../services/model.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CalendarModule,
    RadioButtonModule,
    InputNumberModule,
    FileUploadModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  demandForm: FormGroup;
  imageForm: FormGroup;
  imageSelected: Boolean = false;
  textForm: FormGroup;

  demandResult: string = '';
  imageResult: string = '';
  textResult: string = '';

  selectedImage: File | null = null;

  constructor(private fb: FormBuilder, private modelService: ModelService) {
    this.demandForm = this.fb.group({
      date: [''],
      holiday: ['no'],
      temperature: [''],
    });

    this.imageForm = this.fb.group({
      image_file: [null],
    });

    this.textForm = this.fb.group({
      inputText: [''],
    });
  }

  // Método para capturar la imagen seleccionada desde p-fileUpload
  onImageSelected(event: any) {
    const file = event.files[0];
    this.selectedImage = file;
    this.imageSelected = true;
    console.log('Imagen seleccionada:', file);
  }

  submitDemandForm() {
    console.log('Formulario de Predicción de Demanda enviado');
    const formData = this.demandForm.value;

    // Convertir la fecha a formato "YYYY-MM-DD"
    const date =
      formData.date instanceof Date
        ? formData.date.toISOString().slice(0, 10)
        : formData.date;

    // Construir el payload que espera el backend:
    // "date": string, "isHoliday": boolean, "temperature": number
    const payload = {
      date: date,
      isHoliday: formData.holiday === 'yes', // true si es "yes", false de lo contrario
      temperature: Number(formData.temperature),
    };

    console.log('Payload a enviar:', payload);

    // Realizar la llamada al backend mediante el servicio.
    this.modelService.getTimeSeries(payload).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        // Se asume que el backend devuelve un objeto { result: <número> }
        this.demandResult = response.result;
      },
      error: (error) => {
        console.error('Error al llamar al backend:', error);
      },
    });
  }

  submitImageForm() {
    if (this.selectedImage) {
      console.log('Formulario de Clasificación de Imágenes enviado');
      const formData = new FormData();
      formData.append('image_file', this.selectedImage);

      // Llamada al servicio para enviar la imagen
      this.modelService.sendImage(formData).subscribe({
        next: (response) => {
          console.log('Respuesta del backend:', response);
          this.imageResult = response.result;
        },
        error: (error) => {
          console.error('Error al enviar la imagen:', error);
        },
      });
    } else {
      console.log('No se seleccionó ninguna imagen');
    }
  }

  submitTextForm() {
    console.log('Formulario de Generación de Texto enviado');
    const formData = this.textForm.value; // { inputText: 'texto ingresado' }

    this.modelService.getTextGenerator(formData).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        this.textResult = response.result;
      },
      error: (error) => {
        console.error('Error al generar texto:', error);
      },
    });
  }
}

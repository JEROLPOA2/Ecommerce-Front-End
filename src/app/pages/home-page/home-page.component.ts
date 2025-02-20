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
      product_id: [''],
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
        console.log('Demanda:', this.demandResult);
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
          this.imageResult = response;
          console.log('Clase:', this.imageResult);
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
    const productId = this.textForm.value.product_id;

    this.modelService.getTextGenerator(productId).subscribe({
      next: (response) => {
        /*
         Suponiendo que response es un array de objetos con la siguiente forma:
         {
            "product_id": 22657,
            "name": "kleio womens ...",
            "main_category": "accessories",
            "sub_category": "Handbags And Clutches",
            "ratings": "5.0",
            "similarity_score": 0.99754
         }
         */

        // Formateamos cada objeto para imprimirlo tal y como se desea
        this.textResult = response.map((item: any) => {
          return (
            `main_category:  "${item.main_category}"\n` +
            `name:  "${item.name}"\n` +
            `product_id:  ${item.product_id}\n` +
            `ratings:  "${item.ratings}"\n` +
            `similarity_score:  ${item.similarity_score}\n` +
            `sub_category:  "${item.sub_category}"\n\n`
          );
        });

        console.log('Respuesta formateada:', this.textResult);
      },
      error: (error) => {
        console.error('Error al generar texto:', error);
      },
    });
  }
}

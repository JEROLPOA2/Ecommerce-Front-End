import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  // Asegúrate de que esta URL coincida con la ubicación y puerto de tu backend.
  // private apiUrl = 'http://localhost:4321/api/';
  private timeSeries =
    ' https://ecommerce-back-end-y01i.onrender.com/api/get-time-series';
  private imageClassifier =
    ' https://ecommerce-back-end-y01i.onrender.com/api/get-image-classifier';
  private textGenerator =
    'https://recomdenderapi.onrender.com/recommendations/by-product-id';

  constructor(private http: HttpClient) {}

  getTimeSeries(data: any): Observable<any> {
    return this.http.post<any>(this.timeSeries, data);
  }

  // Nuevo método para enviar la imagen al backend
  sendImage(formData: FormData): Observable<any> {
    console.log('Enviando imagen al backend con los siguientes datos:');

    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}:`, value);
    }
    return this.http.post<any>(this.imageClassifier, formData);
  }

  getTextGenerator(data: any): Observable<any> {
    console.log('Enviando texto para generación:', data);
    return this.http.post<any>(this.textGenerator, data);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  // Endpoints de tu backend
  private timeSeries =
    'https://coral-app-f3pob.ondigitalocean.app/api/get-time-series';
  private imageClassifier =
    'https://goldfish-app-x9h7b.ondigitalocean.app/api/get-image-classifier';
  private textGenerator =
    'https://goldfish-app-x9h7b.ondigitalocean.app/recommendations/by-product-id';

  private randomProducts =
    'https://goldfish-app-x9h7b.ondigitalocean.app/getRandomProducts';

  constructor(private http: HttpClient) {}

  getTimeSeries(data: any): Observable<any> {
    return this.http.post<any>(this.timeSeries, data).pipe(
      map((response) => {
        // Suponiendo que response.result es la cadena base64
        const base64 = response.result.trim();
        // Se construye el data URL para que se pueda mostrar la imagen en un <img>
        response.result = 'data:image/png;base64,' + base64;
        return response;
      })
    );
  }

  // Envío de imagen al backend
  sendImage(formData: FormData): Observable<any> {
    console.log('Enviando imagen al backend con los siguientes datos:');
    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}:`, value);
    }
    return this.http.post<any>(this.imageClassifier, formData);
  }

  // Solicitud GET con parámetro en la query (product_id)
  getTextGenerator(productId: string): Observable<any> {
    console.log('Enviando texto para generación con ID:', productId);
    return this.http.get<any>(`${this.textGenerator}?product_id=${productId}`);
  }

  getRandomProducts(): Observable<any> {
    return this.http.get<any>(this.randomProducts);
  }
}

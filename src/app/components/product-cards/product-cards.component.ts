import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ModelService } from '../../services/model.service';

@Component({
  selector: 'app-product-cards',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './product-cards.component.html',
  styleUrls: ['./product-cards.component.scss'],
})
export class ProductCardsComponent implements OnInit {
  products: any[] = [];
  recommendedText: string = '';
  loading: boolean = true;

  constructor(private modelService: ModelService) {}

  ngOnInit(): void {
    this.modelService.getRandomProducts().subscribe({
      next: (response) => {
        // Si response es un arreglo, asignarlo directamente, si es un objeto, transformarlo a arreglo.
        this.products = Array.isArray(response)
          ? response
          : Object.values(response);
        console.log('Random Products processed:', this.products);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching random products:', error);
        this.loading = false;
      },
    });
  }

  recommend(productId: number | string): void {
    console.log('Recomendar producto con id:', productId.toString());
    this.modelService.getTextGenerator(productId.toString()).subscribe({
      next: (response) => {
        this.recommendedText = response
          .map((item: any) => {
            return (
              `main_category: "${item.main_category}"\n` +
              `name: "${item.name}"\n` +
              `product_id: ${item.product_id}\n` +
              `ratings: "${item.ratings}"\n` +
              `similarity_score: ${item.similarity_score}\n` +
              `sub_category: "${item.sub_category}"\n\n`
            );
          })
          .join('');
        console.log('Texto recomendado:', this.recommendedText);
      },
      error: (error) => {
        console.error('Error generando texto:', error);
      },
    });
  }
}

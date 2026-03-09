// directives/highlight-recommended.directive.ts
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { MenuItem } from '../models';

/**
 * HighlightRecommendedDirective
 * Adds a golden border and a "Chef's Pick" ribbon to recommended items.
 * Usage: <mat-card [appHighlightRecommended]="menuItem">
 */
@Directive({
  selector: '[appHighlightRecommended]'
})
export class HighlightRecommendedDirective implements OnInit {
  @Input('appHighlightRecommended') menuItem!: MenuItem;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.menuItem?.isRecommended) {
      this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid #c9a84c');
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 0 2px rgba(201,168,76,0.2)');
      this.renderer.addClass(this.el.nativeElement, 'recommended-item');
    }
  }
}

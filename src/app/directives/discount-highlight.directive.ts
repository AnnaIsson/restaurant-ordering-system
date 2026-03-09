// directives/discount-highlight.directive.ts
import { Directive, ElementRef, Input, OnInit, OnChanges, Renderer2 } from '@angular/core';

/**
 * DiscountHighlightDirective
 * Applies a red discount badge overlay to discounted items.
 * Usage: <div [appDiscountHighlight]="item.isDiscounted" [discountPercent]="item.discountPercent">
 */
@Directive({
  selector: '[appDiscountHighlight]'
})
export class DiscountHighlightDirective implements OnInit, OnChanges {
  @Input('appDiscountHighlight') isDiscounted!: boolean;
  @Input() discountPercent!: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.applyStyles();
  }

  ngOnChanges(): void {
    this.applyStyles();
  }

  private applyStyles(): void {
    if (this.isDiscounted) {
      this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
      this.renderer.addClass(this.el.nativeElement, 'discounted-item');
    }
  }
}

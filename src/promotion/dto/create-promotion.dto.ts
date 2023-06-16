export class CreatePromotionDto {
  text: string;
  active?: boolean;
  color?: 'green' | 'red' | 'blue' | 'orange' | 'yellow' | 'purple' | 'peach';
}

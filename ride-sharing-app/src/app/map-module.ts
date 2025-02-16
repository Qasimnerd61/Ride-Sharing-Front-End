import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAUnuPXweOavCoI5FlyO5z4UXf_6y74Zfg',
    }),
  ],
  exports: [AgmCoreModule],
})
export class MapModule {}

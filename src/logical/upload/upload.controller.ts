import { Controller, Get, Render, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Controller('upload')
export class UploadController {
  @Post('add')
  @UseInterceptors(FileInterceptor('files'))
  doAdd(@Body() body) {
    const { file } = body;
    console.log('===========================================');
    console.log(file.name); //上传图片的信息  必须在form的属性里面配置enctype="multipart/form-data"
    console.log('===========================================');
    const writeStream = createWriteStream(
      join(
        'D:',
        '/upload',
        `${Date.now()}-${file.name}`,
      ),
    );
    writeStream.write(file.thumbUrl);
    return '上传图片成功';
  }
}

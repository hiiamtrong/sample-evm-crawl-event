import './shared/utils/json'
import { NestFactory } from "@nestjs/core";
import { CrawlerModule } from "src/modules/crawler/crawler.module";
import { BuyCrawler } from "src/modules/crawler/runners/buy.crawler";

async function bootstrap() {
    const app = await NestFactory.create(CrawlerModule);
    const crawler = app.get(BuyCrawler);
    await crawler.start();
}

bootstrap();
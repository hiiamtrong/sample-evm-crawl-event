import './shared/utils/json'
import { NestFactory } from "@nestjs/core";
import { CrawlerModule } from "src/modules/crawler/crawler.module";
import { EventCrawler } from "src/modules/crawler/runners/event.crawler";

async function bootstrap() {
    const app = await NestFactory.create(CrawlerModule);
    const eventCrawler = app.get(EventCrawler);
    await Promise.all([
        eventCrawler.start(),
    ]);
}

bootstrap();
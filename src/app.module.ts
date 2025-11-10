import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { MongooseModule } from '@nestjs/mongoose'; 
import { TasksModule } from './tasks/tasks.module'; 
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Module to load environment variables
    ConfigModule.forRoot({ 
      isGlobal: true, 
      envFilePath: ['.env.development.local', '.env'], 
    }), 
    // Module to connect to MongoDB
    MongooseModule.forRootAsync({ 
      imports: [ConfigModule],
      inject: [ConfigService], 
      useFactory: (config: ConfigService) => { 
        const useAtlas = config.get<string>('USE_ATLAS') === 'true'; 
        const uri = useAtlas 
          ? config.get<string>('MONGODB_URI_ATLAS') 
          : config.get<string>('MONGODB_URI'); 
        if (!uri) { 
          throw new Error('Missing MongoDB URI. Check your .env values.'); 
        } 
        return { uri }; 
      }, 
    }),
    TasksModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['cityName', 'aqius', 'createdAt'])
export class AirQuality {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cityName: string;

    @Column({ type: 'timestamptz' })
    ts: Date;

    @Column()
    aqius: number;

    @Column()
    aqicn: number;

    @Column()
    mainus: string;

    @Column()
    maincn: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

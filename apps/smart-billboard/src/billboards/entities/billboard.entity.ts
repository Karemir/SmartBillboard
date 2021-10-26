import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Billboard {
    @PrimaryColumn({ type: 'varchar' })
    address: string;

    @Column({ type: 'varchar' })
    location: string;

    @Column({ type: 'varchar' })
    description: string;

    @Column({ type: 'varchar' })
    type: string;
}
import {Column, PrimaryColumn, Entity, JoinColumn, ManyToOne} from "typeorm";
import {Curso} from "./CursoModel";
import {Estudiante} from "./EstudianteModel";
@Entity('curso_estudiantes')
export class CursoEstudiante{
	@PrimaryColumn()
	estudiante_id:number;
	@PrimaryColumn()
	curso_id:number;
	@Column()
	nota:number;
	@Column({type:Date, default:()=>'CURRENT_DATE'})
	fecha:Date;
    
    @ManyToOne(()=>Estudiante,(estudiante)=>estudiante.cursos)
    @JoinColumn({name:'estudiante_id'})
    public estudiante:Estudiante;

	@ManyToOne(() => Curso, (curso) => curso.estudiantes)
    @JoinColumn({name: 'curso_id'})
    public curso: Curso;
}
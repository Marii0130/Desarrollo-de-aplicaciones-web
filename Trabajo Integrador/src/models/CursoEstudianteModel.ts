import {Column, PrimaryColumn, Entity, JoinColumn, ManyToOne} from "typeorm";
import {Curso} from "./CursoModel";
import {Estudiante} from "./EstudianteModel";
@Entity('curso_estudiantes')
export class CursoEstudiante{
	@PrimaryColumn()
	profesor_id:number;
	@PrimaryColumn()
	curso_id:number;
	@Column({type:'float', default:()=>0})
	nota:number;
	@Column({type:Date, default:()=>'CURRENT_DATE'})
	fecha:Date;
    
    @ManyToOne(()=>Estudiante,(estudiante)=>estudiante.cursos)
    @JoinColumn({name:'estudiante_id'})
    public estudiante:Estudiante;
}
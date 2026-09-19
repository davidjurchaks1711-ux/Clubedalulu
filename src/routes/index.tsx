import { createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Clock3,
  Ellipsis,
  Heart,
  Leaf,
  Plus,
  RefreshCw,
  Stethoscope,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/')({
  component: AgendaPage,
})

type AppointmentTone = 'pink' | 'green' | 'purple' | 'orange' | 'blue'

type Appointment = {
  day: number
  time: string
  patient: string
  label: string
  tone: AppointmentTone
  icon: 'user' | 'repeat' | 'exam' | 'procedure'
  completed?: boolean
  more?: boolean
}

const appointments: Appointment[] = [
  { day: 30, time: '09:00', patient: 'Silvia Leticia de Moraes', label: 'Consulta', tone: 'pink', icon: 'user', completed: true },
  { day: 30, time: '10:00', patient: 'Ana Paula Costa', label: 'Consulta', tone: 'purple', icon: 'user', completed: true },
  { day: 1, time: '09:00', patient: 'David', label: 'Teleconsulta', tone: 'blue', icon: 'user', more: true },
  { day: 4, time: '14:00', patient: 'Juliana', label: 'Retorno', tone: 'green', icon: 'repeat' },
  { day: 7, time: '08:30', patient: 'Consulta ginecológica', label: 'Consulta', tone: 'pink', icon: 'procedure' },
  { day: 10, time: '09:00', patient: 'Silvia Leticia de Moraes', label: 'Consulta', tone: 'pink', icon: 'user', completed: true },
  { day: 10, time: '10:00', patient: 'David', label: 'Consulta', tone: 'blue', icon: 'user', completed: true },
  { day: 11, time: '15:30', patient: 'Exame preventivo', label: 'Exame', tone: 'purple', icon: 'exam' },
  { day: 14, time: '11:00', patient: 'Ana Paula Costa', label: 'Consulta', tone: 'green', icon: 'procedure', completed: true },
  { day: 16, time: '09:00', patient: 'Ana', label: 'Retorno', tone: 'pink', icon: 'repeat', more: true },
  { day: 21, time: '10:00', patient: 'Consulta ginecológica', label: 'Consulta', tone: 'orange', icon: 'procedure' },
  { day: 23, time: '14:30', patient: 'Camila', label: 'Retorno', tone: 'green', icon: 'repeat', more: true },
  { day: 25, time: '09:00', patient: 'Ultrassonografia', label: 'Procedimento', tone: 'pink', icon: 'exam' },
  { day: 28, time: '16:00', patient: 'Consulta nova', label: 'Consulta', tone: 'purple', icon: 'user' },
  { day: 30, time: '10:00', patient: 'Patrícia', label: 'Retorno', tone: 'blue', icon: 'repeat', more: true },
]

const toneStyles: Record<AppointmentTone, { card: string; icon: string; text: string }> = {
  pink: { card: 'bg-[#fce1ee]', icon: 'text-[#e52d72]', text: 'text-[#542442]' },
  green: { card: 'bg-[#dff4ef]', icon: 'text-[#0c8f73]', text: 'text-[#126454]' },
  purple: { card: 'bg-[#ebe4ff]', icon: 'text-[#6541d8]', text: 'text-[#403080]' },
  orange: { card: 'bg-[#ffeadc]', icon: 'text-[#e76715]', text: 'text-[#934313]' },
  blue: { card: 'bg-[#dcecff]', icon: 'text-[#1675da]', text: 'text-[#19466f]' },
}

const weekdays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const calendarDays = [
  { day: 30, outside: true },
  { day: 31, outside: true },
  ...Array.from({ length: 30 }, (_, index) => ({ day: index + 1, outside: false })),
  { day: 1, outside: true },
  { day: 2, outside: true },
  { day: 3, outside: true },
]

function AppointmentIcon({ type }: { type: Appointment['icon'] }) {
  if (type === 'repeat') return <RefreshCw className="h-5 w-5" />
  if (type === 'exam') return <Activity className="h-5 w-5" />
  if (type === 'procedure') return <Stethoscope className="h-5 w-5" />
  return <UserRound className="h-5 w-5" />
}

function AgendaPage() {
  const [selectedView, setSelectedView] = useState('Mês')
  const [monthOffset, setMonthOffset] = useState(0)

  const monthLabel = useMemo(() => {
    const date = new Date(2026, 8 + monthOffset, 1)
    return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
      .format(date)
      .replace(/^./, (letter) => letter.toUpperCase())
  }, [monthOffset])

  return (
    <div className="min-h-screen bg-[#fffafb] px-4 py-5 font-sans text-[#30313f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-5 rounded-2xl border border-[#f2e9ee] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(116,55,89,0.04)]">
              <button aria-label="Mês anterior" onClick={() => setMonthOffset((value) => value - 1)} className="text-[#e24782] transition hover:scale-110">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button className="border-l border-[#f2e9ee] pl-5 text-base font-bold text-[#60304f]">Hoje</button>
              <button aria-label="Próximo mês" onClick={() => setMonthOffset((value) => value + 1)} className="text-[#e24782] transition hover:scale-110">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#54213f] sm:text-3xl">{monthLabel}</h1>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[#b17899] sm:text-base">
                Cuidando da sua saúde, em todas as fases da vida <Heart className="h-4 w-4 text-[#ec5d99]" />
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex rounded-2xl bg-[#f8f1f5] p-1.5">
              {['Dia', 'Semana', 'Mês', 'Lista'].map((view) => (
                <button key={view} onClick={() => setSelectedView(view)} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${selectedView === view ? 'bg-[#d93275] text-white shadow-md' : 'text-[#66465b] hover:bg-white'}`}>
                  {view}
                </button>
              ))}
            </div>
            <button className="flex items-center justify-center gap-3 rounded-2xl border border-[#f0e3e9] bg-white px-5 py-3 text-sm font-bold text-[#5e4055] shadow-sm">
              <UsersRound className="h-5 w-5 text-[#e83f7d]" />
              Todos os médicos
              <ChevronDown className="ml-3 h-4 w-4 text-[#db3c78]" />
            </button>
            <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c52d6c] to-[#e74788] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(214,47,112,0.25)] transition hover:-translate-y-0.5">
              <Plus className="h-5 w-5" /> Nova consulta
            </button>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<CalendarDays />} value="12" label="Consultas hoje" tone="pink" />
          <StatCard icon={<UsersRound />} value="328" label="Pacientes ativas" tone="green" />
          <StatCard icon={<Heart />} value="96%" label="Taxa de comparecimento" tone="purple" />
          <StatCard icon={<Clock3 />} value="8" label="Encaixes disponíveis" tone="orange" />
        </div>

        <section className="relative mt-5 overflow-hidden rounded-2xl border border-[#f1e7ec] bg-white shadow-[0_10px_30px_rgba(117,52,87,0.05)]">
          <div className="grid grid-cols-7 border-b border-[#f0e7eb] bg-[#fffdfd]">
            {weekdays.map((weekday, index) => (
              <div key={weekday} className={`py-3 text-center text-sm font-extrabold ${index === 0 ? 'text-[#f05c99]' : 'text-[#444553]'}`}>{weekday}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((calendarDay, index) => {
              const dayAppointments = appointments.filter((appointment) => appointment.day === calendarDay.day && !calendarDay.outside)
              const isToday = calendarDay.day === 19 && !calendarDay.outside
              const isEmptyHighlight = calendarDay.day === 19 && !calendarDay.outside
              return (
                <div key={`${calendarDay.day}-${index}`} className={`relative min-h-[145px] border-b border-r border-[#f0e7eb] p-2 sm:min-h-[166px] sm:p-3 ${calendarDay.outside ? 'bg-[#fffdfd] text-[#aaaab4]' : 'bg-white'} ${isEmptyHighlight ? 'bg-[#fffafd]' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className={`flex h-7 min-w-7 items-center justify-center rounded-full px-1 text-sm font-bold ${isToday ? 'bg-[#d82d72] text-white' : calendarDay.outside ? 'text-[#a7a7b0]' : 'text-[#353644]'}`}>{calendarDay.day}</span>
                    <button aria-label={`Adicionar consulta no dia ${calendarDay.day}`} className="text-[#a9a5af] transition hover:text-[#d83375]"><CirclePlus className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {dayAppointments.map((appointment, appointmentIndex) => <AppointmentCard key={`${appointment.day}-${appointment.time}-${appointmentIndex}`} appointment={appointment} />)}
                    {isEmptyHighlight && <div className="flex h-[90px] flex-col items-center justify-center rounded-xl border border-[#f18db4] bg-[#fff7fb] px-2 text-center text-[#bc6388]"><span className="text-sm font-bold">Nenhuma consulta</span><span className="mt-1 text-xs">Que tal aproveitar<br />para se organizar? ✨</span></div>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <footer className="flex flex-col gap-4 px-2 py-5 text-xs font-medium text-[#8d8992] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Legend color="bg-[#f05ca0]" label="Consulta" />
            <Legend color="bg-[#70cdb6]" label="Retorno" />
            <Legend color="bg-[#9d82ed]" label="Exame" />
            <Legend color="bg-[#ffb080]" label="Procedimento" />
            <Legend color="bg-[#5aa9f7]" label="Teleconsulta" />
          </div>
          <div className="flex items-center gap-2">Saúde feminina <span>•</span> Informação <span>•</span> Bem-estar <span>•</span> Sempre com você <Heart className="h-4 w-4 fill-[#f15a98] text-[#f15a98]" /></div>
        </footer>
      </div>
    </div>
  )
}

function StatCard({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: AppointmentTone }) {
  const styles = { pink: 'bg-[#fff0f6] text-[#d52a6d]', green: 'bg-[#ecfaf6] text-[#087f68]', purple: 'bg-[#f2efff] text-[#4c36b6]', orange: 'bg-[#fff2e8] text-[#d96514]' }
  return <div className={`flex items-center gap-4 rounded-2xl px-5 py-4 ${styles[tone]}`}><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/70">{icon}</div><div><div className="text-2xl font-extrabold leading-none">{value}</div><div className="mt-1 text-sm font-semibold opacity-80">{label}</div></div></div>
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const style = toneStyles[appointment.tone]
  return <div className={`group relative flex items-center gap-2 rounded-xl px-2.5 py-2 ${style.card} ${style.text}`}><div className={style.icon}><AppointmentIcon type={appointment.icon} /></div><div className="min-w-0 flex-1 leading-tight"><div className="text-sm font-extrabold">{appointment.time}</div><div className="truncate text-xs font-semibold">{appointment.patient}</div></div>{appointment.completed && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#11a879] text-[11px] font-bold text-white">✓</span>}{appointment.more && <Ellipsis className="h-4 w-4 shrink-0" />}</div>
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="flex items-center gap-2"><span className={`h-3.5 w-3.5 rounded-full ${color}`} />{label}</span>
}

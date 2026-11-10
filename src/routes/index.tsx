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
import { AppointmentPanels, localDate, useConsultationAgenda } from '../components/ConsultationWorkflow'

export const Route = createFileRoute('/')({
  component: AgendaPage,
})

type AppointmentTone = 'pink' | 'green' | 'purple' | 'orange' | 'blue'

type Appointment = {
  id: string
  dateKey: string
  day: number
  time: string
  patient: string
  label: string
  tone: AppointmentTone
  icon: 'user' | 'repeat' | 'exam' | 'procedure'
  completed?: boolean
  more?: boolean
}

const toneStyles: Record<AppointmentTone, { card: string; icon: string; text: string }> = {
  pink: { card: 'bg-[#fce1ee]', icon: 'text-[#e52d72]', text: 'text-[#542442]' },
  green: { card: 'bg-[#dff4ef]', icon: 'text-[#0c8f73]', text: 'text-[#126454]' },
  purple: { card: 'bg-[#ebe4ff]', icon: 'text-[#6541d8]', text: 'text-[#403080]' },
  orange: { card: 'bg-[#ffeadc]', icon: 'text-[#e76715]', text: 'text-[#934313]' },
  blue: { card: 'bg-[#dcecff]', icon: 'text-[#1675da]', text: 'text-[#19466f]' },
}

const weekdays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

function AppointmentIcon({ type }: { type: Appointment['icon'] }) {
  if (type === 'repeat') return <RefreshCw className="h-5 w-5" />
  if (type === 'exam') return <Activity className="h-5 w-5" />
  if (type === 'procedure') return <Stethoscope className="h-5 w-5" />
  return <UserRound className="h-5 w-5" />
}

function AgendaPage() {
  const [selectedView, setSelectedView] = useState('Mês')
  const [monthOffset, setMonthOffset] = useState(0)
  const [baseMonth] = useState(() => new Date())
  const month = useMemo(() => new Date(baseMonth.getFullYear(), baseMonth.getMonth() + monthOffset, 1), [baseMonth, monthOffset])
  const agenda = useConsultationAgenda(month)
  const appointments = agenda.appointments
  const today = localDate(new Date())
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    const count = Math.ceil((month.getDay() + daysInMonth) / 7) * 7
    return Array.from({ length: count }, (_, index) => {
      const date = new Date(month.getFullYear(), month.getMonth(), index - month.getDay() + 1)
      return { day: date.getDate(), dateKey: localDate(date), outside: date.getMonth() !== month.getMonth() }
    })
  }, [month])

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
      .format(month)
      .replace(/^./, (letter) => letter.toUpperCase())
  }, [month])

  return (
    <div className="min-h-screen bg-[#fffafb] px-4 py-5 font-sans text-[#30313f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-5 rounded-2xl border border-[#f2e9ee] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(116,55,89,0.04)]">
              <button aria-label="Mês anterior" onClick={() => setMonthOffset((value) => value - 1)} className="text-[#e24782] transition hover:scale-110">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={() => { const now = new Date(); setMonthOffset((now.getFullYear() - baseMonth.getFullYear()) * 12 + now.getMonth() - baseMonth.getMonth()) }} className="border-l border-[#f2e9ee] pl-5 text-base font-bold text-[#60304f]">Hoje</button>
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
            <label className="relative flex items-center justify-center gap-3 rounded-2xl border border-[#f0e3e9] bg-white px-5 py-3 text-sm font-bold text-[#5e4055] shadow-sm">
              <UsersRound className="h-5 w-5 shrink-0 text-[#e83f7d]" />
              <select aria-label="Médica da agenda" disabled={!agenda.ready} value={agenda.doctorId} onChange={event => agenda.setDoctorId(event.target.value)} className="w-full max-w-52 appearance-none bg-white pr-6 outline-none focus:ring-2 focus:ring-[#d93275] disabled:opacity-50">
                <option value="">Todos os médicos</option>
                {agenda.doctors.map(doctor => <option key={doctor.id} value={doctor.id}>{doctor.full_name}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-[#db3c78]" />
            </label>
            <button disabled={!agenda.ready} onClick={() => agenda.openNew(today)} className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c52d6c] to-[#e74788] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(214,47,112,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
              <Plus className="h-5 w-5" /> Nova consulta
            </button>
          </div>
        </header>

        <AppointmentPanels agenda={agenda} />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<CalendarDays />} value={String(appointments.filter(appointment => appointment.dateKey === today).length)} label="Consultas hoje nesta agenda" tone="pink" />
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
              const dayAppointments = appointments.filter((appointment) => appointment.dateKey === calendarDay.dateKey)
              const isToday = calendarDay.dateKey === today
              const isEmptyHighlight = isToday && dayAppointments.length === 0 && agenda.ready && !agenda.loading && !agenda.error
              return (
                <div key={`${calendarDay.day}-${index}`} className={`relative min-h-[145px] border-b border-r border-[#f0e7eb] p-2 sm:min-h-[166px] sm:p-3 ${calendarDay.outside ? 'bg-[#fffdfd] text-[#aaaab4]' : 'bg-white'} ${isEmptyHighlight ? 'bg-[#fffafd]' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className={`flex h-7 min-w-7 items-center justify-center rounded-full px-1 text-sm font-bold ${isToday ? 'bg-[#d82d72] text-white' : calendarDay.outside ? 'text-[#a7a7b0]' : 'text-[#353644]'}`}>{calendarDay.day}</span>
                    <button disabled={!agenda.ready} onClick={() => agenda.openNew(calendarDay.dateKey)} aria-label={`Adicionar consulta em ${calendarDay.dateKey}`} className="text-[#a9a5af] transition hover:text-[#d83375] disabled:cursor-not-allowed disabled:opacity-40"><CirclePlus className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {dayAppointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} onClick={() => agenda.openAppointment(appointment.id)} />)}
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

function AppointmentCard({ appointment, onClick }: { appointment: Appointment; onClick: () => void }) {
  const style = toneStyles[appointment.tone]
  return <button type="button" onClick={onClick} title={`${appointment.time} · ${appointment.patient} · ${appointment.label}`} aria-label={`Abrir ficha de ${appointment.patient}, ${appointment.time}`} className={`group relative flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#d93275] ${style.card} ${style.text}`}><span className={style.icon}><AppointmentIcon type={appointment.icon} /></span><span className="min-w-0 flex-1 leading-tight"><span className="block text-sm font-extrabold">{appointment.time}</span><span className="block truncate text-xs font-semibold">{appointment.patient}</span></span>{appointment.completed && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#11a879] text-[11px] font-bold text-white">✓</span>}{appointment.more && <Ellipsis className="h-4 w-4 shrink-0" />}</button>
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="flex items-center gap-2"><span className={`h-3.5 w-3.5 rounded-full ${color}`} />{label}</span>
}

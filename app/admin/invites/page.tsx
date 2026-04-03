import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/control-center/admin-panel?tab=invites');
}

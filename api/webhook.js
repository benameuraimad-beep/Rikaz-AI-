import { createClient } from '@supabase/supabase-js';

// تهيئة Supabase باستخدام متغيرات البيئة
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { event, data } = req.body;

      // التأكد من نجاح الدفع
      if (event === 'payment.succeeded') {
        const userEmail = data.email;

        // تحديث حالة المستخدم في قاعدة البيانات
        const { error } = await supabase
          .from('profiles')
          .update({ is_premium: true })
          .eq('email', userEmail);

        if (error) throw error;
        return res.status(200).json({ status: 'Success' });
      }
      return res.status(200).json({ status: 'Ignored' });
    } catch (err) {
      return res.status(400).json({ error: 'Error processing webhook' });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

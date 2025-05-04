import { useCreateUser, useUpdateUser } from "@/services/user";
import { User, UserFormData, UserUpdateParams } from "@/types/user.type";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export function UserFormDialog({ isOpen, onOpenChange, user, onSuccess }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User;
    onSuccess: () => void;
  }) {
    const [formData, setFormData] = useState<UserFormData>({
      user_name: user?.user_name || '',
      pass_word: ''
    });
    const [errors, setErrors] = useState<{
      user_name?: string;
      pass_word?: string;
    }>({});
  
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
  
    useEffect(() => {
      // 每次对话框打开时重置表单数据
      if (isOpen) {
        setFormData({
          user_name: user?.user_name || '',
          pass_word: ''
        });
        setErrors({}); // 同时重置错误信息
      }
    }, [isOpen, user]);
  
    const validateForm = () => {
      const newErrors: typeof errors = {};
  
      if (!formData.user_name.trim()) {
        newErrors.user_name = '用户名不能为空';
      }
  
      // 只在创建用户时验证密码
      if (!user && formData.pass_word.length < 6) {
        newErrors.pass_word = '密码不能小于6位';
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!validateForm()) {
        return;
      }
  
      try {
        if (user) {
          // 更新用户
          const params: { id: number } & UserUpdateParams = {
            id: user.id,
            user_name: formData.user_name
          };
          if (formData.pass_word) {
            params.pass_word = formData.pass_word;
          }
          await updateUser.mutateAsync(params);
        } else {
          // 创建用户
          await createUser.mutateAsync(formData);
        }
        onSuccess();
        onOpenChange(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{user ? '编辑用户' : '添加用户'}</DialogTitle>
            <DialogDescription>
              {user ? '修改用户信息，密码留空则保持不变。' : '请填写用户信息，所有字段都是必填的。'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user_name" className="text-right">
                  用户名
                </Label>
                <div className="col-span-3">
                  <Input
                    id="user_name"
                    value={formData.user_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
                    className={errors.user_name ? "border-red-500" : ""}
                  />
                  {errors.user_name && (
                    <p className="text-sm text-red-500 mt-1">{errors.user_name}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pass_word" className="text-right">
                  密码
                </Label>
                <div className="col-span-3">
                  <Input
                    id="pass_word"
                    type="password"
                    value={formData.pass_word}
                    placeholder={user ? "留空则保持不变" : "请输入密码"}
                    onChange={(e) => setFormData(prev => ({ ...prev, pass_word: e.target.value }))}
                    className={errors.pass_word ? "border-red-500" : ""}
                  />
                  {errors.pass_word && (
                    <p className="text-sm text-red-500 mt-1">{errors.pass_word}</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
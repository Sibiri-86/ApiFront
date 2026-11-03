import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

interface ModuleAction {
  label: string;
  icon: string;
  route: string;
}

interface ModuleCard {
  title: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  actions: ModuleAction[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  modules: ModuleCard[] = [
    {
      title: 'TVM',
      description: 'Taxe sur les véhicules à moteur : vérifiez une transaction et consultez les quittances.',
      icon: 'pi-car',
      color: 'text-blue-500',
      bg: 'bg-blue-100',
      actions: [
        { label: 'Vérification', icon: 'pi pi-verified', route: '/admin/tvm-verification' },
        { label: 'Consultation', icon: 'pi pi-list', route: '/admin/quittance-tvm' }
      ]
    },
    {
      title: 'Taxe de Résidence',
      description: 'Vérifiez une transaction de taxe de résidence et consultez les paiements par période.',
      icon: 'pi-building',
      color: 'text-orange-500',
      bg: 'bg-orange-100',
      actions: [
        { label: 'Vérification', icon: 'pi pi-verified', route: '/admin/tr-verification' },
        { label: 'Consultation', icon: 'pi pi-list', route: '/admin/quittance-tr' }
      ]
    },
    {
      title: 'Impôt',
      description: 'Consultez les quittances d\'impôt par période, avec total et export CSV.',
      icon: 'pi-wallet',
      color: 'text-green-500',
      bg: 'bg-green-100',
      actions: [
        { label: 'Consultation', icon: 'pi pi-file', route: '/admin/quittance-impot' }
      ]
    },
    {
      title: 'Administration',
      description: 'Gérez les utilisateurs de la plateforme et les modules paramétrables.',
      icon: 'pi-shield',
      color: 'text-purple-500',
      bg: 'bg-purple-100',
      actions: [
        { label: 'Utilisateurs', icon: 'pi pi-users', route: '/admin/user' },
        { label: 'Modules', icon: 'pi pi-th-large', route: '/admin/module-param' }
      ]
    }
  ];
}